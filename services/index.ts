import { dispatch, getState } from "../redux/store";
import { logOut, setToken } from "@/redux/slice/auth-slice";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getNewAccessToken } from "@/utils/token";
import { showAppLoader, showError } from "@/utils/helpers";
import { Platform } from "react-native";
import { router } from "expo-router";
import Constants from "expo-constants";

// ─── Constants ────────────────────────────────────────────────────────────────

export const baseURL =
  process.env.EXPO_PUBLIC_BASE_URL ?? "https://api.getbrane.co/api/v1";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeviceDetails {
  platform: "Android" | "iOS" | "Web";
  browser: string;
  environment: "Standalone" | "Web" | "Native";
}

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
}

interface ExtendedAxiosInstance extends AxiosInstance {
  setToken: (token: string | null) => void;
}

// ─── Device Details ───────────────────────────────────────────────────────────

const getDeviceDetails = (): DeviceDetails => {
  const nativePlatform = Platform.OS;

  // Native environment (iOS / Android)
  if (nativePlatform === "ios") return { platform: "iOS", browser: "Native", environment: "Native" };
  if (nativePlatform === "android") return { platform: "Android", browser: "Native", environment: "Native" };

  // Web fallback
  const userAgent = navigator?.userAgent ?? "";

  let platform: DeviceDetails["platform"] = "Web";
  if (/android/i.test(userAgent)) platform = "Android";
  else if (/iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window)) platform = "iOS";

  let browser = "Unknown";
  if (/chrome|chromium|crios/i.test(userAgent)) browser = "Chrome";
  else if (/firefox/i.test(userAgent)) browser = "Firefox";
  else if (/safari/i.test(userAgent) && !/chrome|chromium|crios/i.test(userAgent)) browser = "Safari";

  const isStandalone =
    typeof window !== "undefined" &&
    window.matchMedia?.("(display-mode: standalone)").matches;

  return { platform, browser, environment: isStandalone ? "Standalone" : "Web" };
};

// ─── Axios Instance ───────────────────────────────────────────────────────────

const BaseRequest = axios.create({
  baseURL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
}) as ExtendedAxiosInstance;

// Convenience method for setting the auth token globally
BaseRequest.setToken = (token: string | null) => {
  if (token) {
    BaseRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete BaseRequest.defaults.headers.common["Authorization"];
  }
};

// ─── Token Refresh Queue ──────────────────────────────────────────────────────

let isRefreshing = false;
let refreshQueue: QueuedRequest[] = [];

const enqueueRequest = (): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    refreshQueue.push({ resolve, reject });
  });

const resolveQueue = (newToken: string) => {
  refreshQueue.forEach(({ resolve }) => resolve(newToken));
  refreshQueue = [];
};

const rejectQueue = (reason: unknown) => {
  refreshQueue.forEach(({ reject }) => reject(reason));
  refreshQueue = [];
};

// ─── Request Interceptor ──────────────────────────────────────────────────────

BaseRequest.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { platform, browser, environment } = getDeviceDetails();

    config.headers["X-Platform"] = platform;
    config.headers["X-Browser"] = browser;
    config.headers["X-Environment"] = environment;

    // Optionally attach app version for debugging
    const appVersion = Constants.expoConfig?.version;
    if (appVersion) config.headers["X-App-Version"] = appVersion;

    const token = getState().auth?.token;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

BaseRequest.interceptors.response.use(
  (response: AxiosResponse) => response?.data,

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // ── 401 Unauthorized → attempt token refresh ──────────────────────────
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until the refresh resolves
        try {
          const newToken = await enqueueRequest();
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return BaseRequest(originalRequest);
        } catch {
          return Promise.reject("Session Expired");
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getState().auth?.refreshToken;

        const newAccessToken = await getNewAccessToken({
          url: `${baseURL}/auth-service/refresh-token`,
          refreshToken,
        });

        if (!newAccessToken) throw new Error("No access token returned");

        dispatch(setToken({ token: newAccessToken }));
        BaseRequest.setToken(newAccessToken);
        resolveQueue(newAccessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return BaseRequest(originalRequest);
      } catch {
        rejectQueue("Session Expired");
        dispatch(logOut());
        router.replace("/login");
        return Promise.reject("Session Expired");
      } finally {
        isRefreshing = false;
      }
    }

    // ── KYC redirect ─────────────────────────────────────────────────────
    const responseData = error?.response?.data;
    const rawMessage: string = String(responseData?.message ?? error?.message ?? "").toLowerCase();

    if (rawMessage.includes("add bvn")) {
      showAppLoader();
    //   router.push("/kyc/information/bvn-verification");
      return Promise.reject(responseData);
    }

    // ── Friendly network/server messages ─────────────────────────────────
    if (rawMessage.includes("network error")) {
      return Promise.reject("Your internet connection is down, try again later.");
    }

    if (rawMessage.includes("internal server error")) {
      return Promise.reject("Server is temporarily unavailable. Please try again.");
    }

    if (error.code === "ECONNABORTED") {
      return Promise.reject("Request timed out. Please check your connection.");
    }

    return Promise.reject(responseData ?? error?.message);
  }
);

// ─── Error Helpers ────────────────────────────────────────────────────────────

export interface ParsedNetworkError {
  message: string;
  data: Record<string, unknown>;
  shouldLogOut: boolean;
}

export const parseNetworkError = (
  error: unknown,
  processLogout = false
): ParsedNetworkError => {
  const err = error as { status?: number; message?: string | string[] } | null;

  let message: string = typeof error === "string" ? error : "Something went wrong.";
  let shouldLogOut = false;

  if (err?.status === 500) {
    message = "Server could not process your request, please try again.";
  }

  if (err?.status === 401) shouldLogOut = true;

  if (typeof err?.message === "string") {
    message = err.message;
    if (err.message.toLowerCase().includes("unauthenticated")) shouldLogOut = true;
  }

  if (Array.isArray(err?.message)) {
    message = (err.message as string[]).join(", ");
  }

  if (processLogout && shouldLogOut) {
    dispatch(logOut());
    router.replace("/login");
  }

  return { message, data: {}, shouldLogOut };
};

export const catchError = (error: unknown, processLogout = true): void => {
  const { message } = parseNetworkError(error, processLogout);
  showError(message);
};

export default BaseRequest;