import type { ErrorModel } from "../models/Error";
import { useAppStore } from "../store/useAppStore";

/**
 * HTTP Methods (enum removed for Vite compatibility)
 */
const Method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

type RequestOptions<T> = Omit<RequestInit, "body"> & {
  body?: T;
};

const API_BASE = "http://localhost:8080/api";
// const API_BASE = "https://job-board-backend-pfwb.onrender.com/api";

/**
 * Attach headers & auth token
 */
export async function withCredentials(
  options: RequestInit,
  client = "lovable-clone-web",
): Promise<RequestInit> {
  const token = useAppStore.getState().tokens?.accessToken;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Client": client,
    ...(typeof navigator !== "undefined" && {
      "User-Agent": navigator.userAgent,
    }),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { ...options, headers };
}

/**
 * Convert body → JSON (skip FormData)
 */
export function withBody<T>(options: RequestOptions<T>): RequestInit {
  const { body, ...rest } = options;

  if (body && !(body instanceof FormData)) {
    return {
      ...rest,
      body: JSON.stringify(body),
    };
  }

  return options as RequestInit;
}

/**
 * Core request handler
 */
async function call<TBody, TRes>(
  url: string,
  method: string = Method.GET,
  options?: RequestOptions<TBody>,
): Promise<TRes> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const fetchOptions = await withCredentials(withBody({ ...options, method }));

  const config: RequestInit = {
    ...fetchOptions,
    signal: controller.signal,
    credentials: "include",
  };

  // allow browser to set multipart boundary
  if (config.headers) {
    const headers = new Headers(config.headers);

    if (headers.get("Content-Type") === "multipart/form-data") {
      headers.delete("Content-Type");
    }

    config.headers = headers;
  }
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${url}`, config);
  } catch {
    clearTimeout(timeout);
    throw new Error("Network error");
  }

  clearTimeout(timeout);

  /**
   * 🔐 Handle expired token
   */
  if (response.status === 401 && !url.includes("/auth/login")) {
    const { tokens, updateTokens, logout } = useAppStore.getState();
    const refreshToken = tokens?.refreshToken;

    if (!refreshToken) {
      logout();
      throw new Error("Unauthorized");
    }

    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: Method.POST,
      credentials: "include",
    });

    if (refreshRes.ok) {
      const newTokens = await refreshRes.json();
      const tokens = {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      };
      updateTokens(tokens);

      // retry original request
      return call(url, method, options);
    }

    logout();
    throw new Error("Session expired");
  }

  if (!response.ok) {
    const errorBody: ErrorModel = await response.json().catch(() => ({
      success: false,
      message: "Unknown server error",
      status: response.status,
      timestamp: new Date().toISOString(),
    }));

    throw errorBody;
  }

  if (response.status === 204) {
    return null as TRes;
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();
  return text ? (text as unknown as TRes) : (null as TRes); // we have to fix this
}

/**
 * Public API methods
 */
export const API = {
  get<TRes>(url: string) {
    return call<never, TRes>(url, Method.GET);
  },

  post<TBody, TRes>(url: string, body?: TBody) {
    return call<TBody, TRes>(url, Method.POST, { body });
  },

  put<TBody, TRes>(url: string, body?: TBody) {
    return call<TBody, TRes>(url, Method.PUT, { body });
  },

  patch<TBody, TRes>(url: string, body?: TBody) {
    return call<TBody, TRes>(url, Method.PATCH, { body });
  },

  delete<TRes>(url: string) {
    return call<never, TRes>(url, Method.DELETE);
  },
};
