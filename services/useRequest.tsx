import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import BaseRequest, { catchError } from "./index";
import useSWR, { KeyedMutator, mutate } from "swr";
import type { SWRConfiguration } from "swr";
import { useAppState } from "@/redux/store";
import { hideAppLoader, showAppLoader } from "@/utils/helpers";

// ─── Pagination Types ─────────────────────────────────────────────────────────

export interface PaginationLink {
  url: string;
  label: string;
  active: boolean;
}

export interface PaginationState {
  current_page?: number;
  currentPage?: number;
  first_page_url?: string | null;
  from?: number;
  last_page?: number;
  last_page_url?: string | null;
  links?: PaginationLink[];
  next_page_url?: string | null;
  path?: string;
  per_page?: number;
  prev_page_url?: string | null;
  to?: number;
  total?: number;
  totalPages?: number;
  totalRecords?: number;
  perPage?: number;
}

// ─── Config Types ─────────────────────────────────────────────────────────────

interface RequestConfig<TData = unknown> extends SWRConfiguration {
  /** Which HTTP method to use. Defaults to "get". */
  method?: "get" | "post" | "put" | "patch" | "delete";
  /** Override the base URL for this request. */
  baseUrl?: string;
  /** Dot-notated path to pluck from the response, e.g. "data" or "data.records". */
  node?: string;
  /** Fallback value before data arrives. */
  initialValue?: TData;
  /** Default query params. */
  params?: Record<string, unknown>;
  /** Show the global app loader while fetching. */
  showLoading?: boolean;
  /** Show a global error toast on failure. */
  showError?: boolean;
  /** Navigate back if the request fails. */
  goBackOnError?: boolean;
  /** Accumulate pages instead of replacing data (infinite scroll). */
  keepPaginatedData?: boolean;
  /** Called once when new data arrives. */
  onDone?: (data: TData) => void;
  /** Custom error handler. */
  handleError?: (error: unknown) => void;
}

const DEFAULT_CONFIG: Required<
  Pick<
    RequestConfig,
    | "method"
    | "node"
    | "initialValue"
    | "params"
    | "showLoading"
    | "showError"
    | "goBackOnError"
    | "keepPaginatedData"
    | "revalidateIfStale"
    | "revalidateOnFocus"
    | "revalidateOnReconnect"
    | "refreshInterval"
    | "shouldRetryOnError"
    | "keepPreviousData"
  >
> = {
  method: "get",
  node: "data",
  initialValue: {},
  params: {},
  showLoading: false,
  showError: false,
  goBackOnError: false,
  keepPaginatedData: false,
  revalidateIfStale: true,
  revalidateOnFocus: false, // avoid aggressive refetching on RN app focus events
  revalidateOnReconnect: true,
  refreshInterval: 0,
  shouldRetryOnError: false,
  keepPreviousData: true,
};

// ─── Response Type ────────────────────────────────────────────────────────────

export interface RequestResponse<TData = unknown> extends PaginationState {
  data: TData;
  isLoading: boolean;
  isValidating: boolean;
  params: Record<string, unknown>;
  /**
   * Typed as `KeyedMutator<any>` intentionally: Axios interceptors transform
   * the response at runtime (returning `response.data`), but Axios's static
   * types still declare `AxiosResponse` as the return. SWR infers its cache
   * type from those static types, creating an unresolvable mismatch with any
   * other generic. `any` here is accurate — it reflects the real runtime shape.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate: KeyedMutator<any>;
  onRefresh: () => Promise<void>;
  onChangeParams: (patch: Record<string, unknown>) => void;
  setParams: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  onLoadMore: () => void;
  onLoadPrevious: () => void;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

/**
 * Wraps BaseRequest in a plain async function so SWR doesn't see Axios's
 * `AxiosResponse` wrapper type — just the resolved data value.
 */
const makeFetcher =
  (method: RequestConfig["method"] = "get") =>
  async (url: string): Promise<unknown> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (BaseRequest[method] as any)(url);
    return result;
  };

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useRequest = <TData = unknown>(
  path: string | null,
  configuration?: RequestConfig<TData>
): RequestResponse<TData> => {
  const { token } = useAppState();
  const config = { ...DEFAULT_CONFIG, ...configuration };

  // Keep a stable fetcher reference — only recreate if method changes
  const fetcherRef = useRef(makeFetcher(config.method));
  useEffect(() => {
    fetcherRef.current = makeFetcher(config.method);
  }, [config.method]);

  // Sync auth token into BaseRequest headers reactively
  useEffect(() => {
    BaseRequest.setToken(token ?? null);
  }, [token]);

  // ── Params ──────────────────────────────────────────────────────────────
  const [params, setParams] = useState<Record<string, unknown>>(config.params);

  const onChangeParams = useCallback((patch: Record<string, unknown>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  // Build the full URL with query string; null key pauses SWR fetching
  const url = path
    ? (() => {
        const qs = new URLSearchParams(
          Object.entries(params).reduce<Record<string, string>>(
            (acc, [k, v]) => {
              if (v !== undefined && v !== null) acc[k] = String(v);
              return acc;
            },
            {}
          )
        ).toString();
        return `${path}${qs ? `?${qs}` : ""}`;
      })()
    : null;

  // ── SWR ─────────────────────────────────────────────────────────────────
  const {
    data: rawData,
    error,
    isValidating,
    mutate: swrMutate,
  } = useSWR(url, fetcherRef.current, {
    revalidateIfStale: config.revalidateIfStale,
    revalidateOnFocus: config.revalidateOnFocus,
    revalidateOnReconnect: config.revalidateOnReconnect,
    refreshInterval: config.refreshInterval,
    shouldRetryOnError: config.shouldRetryOnError,
    keepPreviousData: config.keepPreviousData,
  });

  // ── Derived State ────────────────────────────────────────────────────────
  const [resolvedData, setResolvedData] = useState<TData>(
    config.initialValue as TData
  );
  const [paginationState, setPaginationState] = useState<PaginationState>({});
  const [accumulatedPages, setAccumulatedPages] = useState<unknown[]>([]);

  // ── Side effects: error handling ─────────────────────────────────────────
  useEffect(() => {
    if (!error) return;
    if (config.goBackOnError) router.back();
    if (config.showError) catchError(error);
    config.handleError?.(error);
  }, [error]);

  // ── Side effects: loader ─────────────────────────────────────────────────
  useEffect(() => {
    if (!config.showLoading) return;
    if (isValidating && !rawData) showAppLoader();
    else hideAppLoader();
  }, [isValidating, rawData, config.showLoading]);

  // ── Side effects: data processing ───────────────────────────────────────
  useEffect(() => {
    if (rawData === undefined) return;
    processData(rawData);
    config.onDone?.(rawData as TData);
  }, [config, rawData]);

  const processData = useCallback(
    (raw: unknown) => {
      const node = config.node ?? "";

      if (typeof raw !== "object" || raw === null) {
        setResolvedData((raw as TData) ?? (config.initialValue as TData));
        setPaginationState({});
        return;
      }

      const obj = raw as Record<string, unknown>;

      // Standard `{ data: { records, ...pagination } }` shape
      if (node === "data" && "data" in obj) {
        const inner = obj.data as Record<string, unknown>;

        if (inner && typeof inner === "object" && "records" in inner) {
          const { records, ...pagination } = inner as {
            records: unknown[];
            [key: string]: unknown;
          };
          setPaginationState(pagination as PaginationState);

          const incoming = records ?? (config.initialValue as unknown[]);
          if (config.keepPaginatedData) {
            setAccumulatedPages((prev) => [...prev, ...incoming]);
          } else {
            setResolvedData(incoming as TData);
          }
          return;
        }

        setPaginationState({});
        setResolvedData(
          ((inner as TData) ?? config.initialValue) as TData
        );
        return;
      }

      // Dot-notated deep access, e.g. node = "meta.items"
      if (node.includes(".")) {
        let cursor: unknown = obj;
        for (const key of node.split(".")) {
          if (cursor && typeof cursor === "object" && key in (cursor as object)) {
            cursor = (cursor as Record<string, unknown>)[key];
          } else {
            cursor = undefined;
            break;
          }
        }
        setResolvedData((cursor as TData) ?? (config.initialValue as TData));
        return;
      }

      setResolvedData((obj as TData) ?? (config.initialValue as TData));
      setPaginationState({});
    },
    [config.node, config.initialValue, config.keepPaginatedData]
  );

  // ── Pagination helpers ───────────────────────────────────────────────────
  const onLoadMore = useCallback(() => {
    const current = paginationState.current_page ?? 1;
    const last = paginationState.last_page ?? 1;
    if (current < last) onChangeParams({ page: current + 1 });
  }, [paginationState, onChangeParams]);

  const onLoadPrevious = useCallback(() => {
    const current = paginationState.current_page ?? 1;
    if (current > 1) onChangeParams({ page: current - 1 });
  }, [paginationState, onChangeParams]);

  // ── Refresh ──────────────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    await swrMutate(undefined, { revalidate: true });
  }, [swrMutate]);

  // ── Return ───────────────────────────────────────────────────────────────
  return {
    ...paginationState,
    data: config.keepPaginatedData ? (accumulatedPages as TData) : resolvedData,
    isLoading: isValidating && !rawData,
    isValidating,
    params,
    mutate: swrMutate,
    onRefresh,
    onChangeParams,
    setParams,
    onLoadMore,
    onLoadPrevious,
  };
};

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Generate a placeholder image URL from dummyimage.com */
export const textToImage = (
  text: string,
  w = 640,
  h = 640,
  bg = "FFFFFF",
  color = "000000"
): string =>
  `https://dummyimage.com/${w}x${h}/${bg}/${color}?text=${encodeURIComponent(text)}`;

/** No-op placeholder */
export const noAction = (): void => {};

/** Invalidate all SWR keys globally, forcing a refetch everywhere. */
export const reloadAllData = (): Promise<unknown> =>
  mutate(() => true, undefined, { revalidate: true });