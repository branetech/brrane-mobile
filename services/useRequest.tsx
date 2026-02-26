import { useRouter } from "expo-router";
import {useCallback, useEffect, useState} from "react";
import BaseRequest, { catchError} from "./index";
import useSWR, {KeyedMutator, mutate} from "swr";
import {FullConfiguration} from "swr/_internal";
import {useAppState} from "@/redux/store";
import {hideAppLoader, showAppLoader} from "@/utils/helpers";
// import axios from "axios";

export interface PaginationLink {
  url: string;
  label: string;
  active: boolean;
}

export interface PaginationProp {
  current_page?: number;
  currentPage?: number;
  first_page_url?: string | null;
  from?: number;
  last_page?: number;
  last_page_url?: string | null;
  links?: PaginationLink[];
  data?: any[];
  next_page_url?: string | null;
  path?: string;
  per_page?: number;
  prev_page_url?: string | null;
  to?: number;
  total?: number;
  totalPages?: number;
  totalRecords?: number;
  perPage?: number;
  isValidating?: boolean;
}

interface DefaultConfig {
  goBackOnError: boolean;
  handleError: (error: any) => any;
  initialValue: {};
  params: Record<string, any>;
  keepPreviousData: boolean;
  method: string;
  baseUrl: string;
  node: string;
  onDone: (data: any) => any;
  refreshInterval: number;
  revalidateIfStale: boolean;
  noCache: boolean;
  revalidateOnFocus: boolean;
  revalidateOnReconnect: boolean;
  shouldRetryOnError: boolean;
  showError: boolean;
  showLoading: boolean;
  keepPaginatedData: boolean;
}

interface ConfigProp {
  [key: string]: any;
}

const defaultConfig: DefaultConfig = {
  method: "get",
  baseUrl: "",
  onDone: (data) => data,
  handleError: (error) => error,
  initialValue: {},
  node: "data",
  showError: false,
  noCache: true,
  showLoading: false,
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  shouldRetryOnError: false,
  keepPreviousData: true,
  keepPaginatedData: false,
  goBackOnError: false,
  params: {},
};

export interface ResponseProps extends PaginationProp {
  isValidating: boolean;
  isLoading: boolean;
  data: any;
  onRefresh: () => void;
  onChangeParams: (param: Record<string, any>) => void;
  setParams: (param: Record<string, any>) => void;
  mutate: KeyedMutator<any>;
  params: Record<string, any>;
  onLoadMore: () => void;
  onLoadPrevious: () => void;
}

// {...rest, data: res,}

export const useRequest = (
  path: string,
  configuration?: FullConfiguration | DefaultConfig | ConfigProp,
  options = {}
) => {
  // @ts-ignore
  const {token} = useAppState();
  const router = useRouter();
  const config = {...defaultConfig, ...configuration};
  const {params: defaultParams} = config;
  const [params, setParams] = useState<Record<string, any>>(defaultParams);
  const onChangeParams = (state: object) =>
    setParams((prevState: any) => ({...prevState, ...state}));

  const others = {
    revalidateIfStale: config?.revalidateIfStale,
    revalidateOnFocus: config?.revalidateOnFocus,
    revalidateOnReconnect: config?.revalidateOnReconnect,
    refreshInterval: config?.refreshInterval,
    shouldRetryOnError: config?.shouldRetryOnError,
    keepPreviousData: config?.keepPreviousData,

    ...options,
  };
  if (token)
    BaseRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  if (config?.noCache) {
    BaseRequest.defaults.headers["Cache-Control"] = "no-cache";
    BaseRequest.defaults.headers["cache"] = false;
  }
  //@ts-ignore
  let fetcher: any = path ? BaseRequest?.[config?.method || "get"] : {};
  if (config.baseUrl) {
    //@ts-ignore
    fetcher = path ? fetch : {};
  }
  let url = path;
  if (typeof params == "object") {
    const searchParams = new URLSearchParams(params).toString();
    url = `${path}${searchParams ? `?${searchParams}` : ""}`;
  }
  const {data, error, isValidating, mutate} = useSWR(url, fetcher, others);

  const [initialValue, setInitialValue] = useState(config?.initialValue);
  const [paginated, setPaginated] = useState([]);
  const [paginationState, setPaginationState] = useState<PaginationProp | any>({});

  const onLoadMore = useCallback(() => {
    let current_page = paginationState?.current_page || 1;
    let last_page = paginationState?.last_page || 1;
    let page = last_page;
    if (current_page < last_page) page = current_page + 1;
    setPaginated(paginated);
    onChangeParams({page});
  }, [paginationState, paginated]);

  const onLoadPrevious = useCallback(() => {
    let current_page = paginationState?.current_page || 1;
    let last_page = paginationState?.last_page || 1;
    let page = 1;
    if (current_page > 1 && current_page < last_page) page = current_page - 1;
    setPaginated(paginated);
    onChangeParams({page});
  }, [paginationState, paginated]);

  useEffect(() => {
    if (error) {
      if (config.goBackOnError) router.back();
      if (config.showError) catchError(error);
      if (config?.handleError) config?.handleError(error);
    }
  }, [error]);

  useEffect(() => {
    if (config.showLoading) {
      if (isValidating && !data) showAppLoader();
      else hideAppLoader();
    }
  }, [isValidating]);

  useEffect(() => {
    if (data && config.onDone) config?.onDone(data);
    handleDataCleaning();
  }, [data]);

  const handleDataCleaning = () => {
    let node = config?.node || "";
    if (typeof data === "object") {
      if (node === "data" && data.hasOwnProperty("data")) {
        if (data?.data?.records) {
          const {records, ...p} = data?.data
          setPaginationState(p || {});
          const currentData = records || config?.initialValue;
          if (config.keepPaginatedData) {
            //@ts-ignore
            setPaginated([...paginated, ...currentData]);
            return;
          }
          setInitialValue(currentData);
          return;
        }
        setPaginationState({});
        setInitialValue(data?.data || config?.initialValue);
        return;
      }

      if (node.includes(".")) {
        const nodes = node.split(".");
        let expected = data;
        try {
          nodes.forEach((n) => (expected = expected[n]));
        } catch (e) {
        }
        setInitialValue(expected || config?.initialValue);
        return;
      }
    }
    setInitialValue(data || config?.initialValue);
    setPaginationState({});
  };

  const onRefresh = async () => {
    handleDataCleaning();
    await mutate({data}, {revalidate: true});
  };
  const RESPONSE: ResponseProps = {
    ...paginationState,
    isValidating,
    mutate,
    data: config.keepPaginatedData ? paginated : initialValue,
    isLoading: isValidating,
    params,
    onChangeParams,
    onLoadPrevious,
    onLoadMore,
    setParams,
    onRefresh,
  };
  return RESPONSE;
};


export const textToImage = (
  text: string,
  w = 640,
  h = 640,
  bg = "FFFFFF",
  color = "000000"
) => `https://dummyimage.com/${w}x${h}/${bg}/${color}?text=${text}`;

export const noAction = () => {
};
export const onReloadData = async () => {
  await mutate((key:any) => key);
}
