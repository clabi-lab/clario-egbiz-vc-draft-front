import { ApiError } from "./errorHandler";

const isServer = typeof window === "undefined";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER;

if (!BASE_URL) {
  throw new Error("Missing BASE_URL environment variable.");
}

interface ApiOptions<TRequestBody = unknown> extends RequestInit {
  retryCount?: number;
  data?: TRequestBody;
}

async function fetchWithRetry<TResponse>(
  url: string,
  options: ApiOptions,
  attempt = 0
): Promise<TResponse> {
  const { data, retryCount = 2, method = "GET", headers, ...rest } = options;

  try {
    const res = await fetch(url, {
      ...rest,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include",
      body:
        ["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && data
          ? JSON.stringify(data)
          : undefined,
    });

    const responseText = await res.text();

    if (!res.ok) {
      throw new ApiError(`API Error: ${res.status}`, res.status, responseText);
    }

    const parsed = JSON.parse(responseText) as { data: TResponse };
    return parsed.data;
  } catch (err) {
    if (attempt < retryCount) {
      console.warn(`Retrying... [${attempt + 1}]`, url);
      return fetchWithRetry<TResponse>(url, options, attempt + 1);
    }
    throw err;
  }
}

export async function apiClient<TResponse, TRequestBody = unknown>(
  endpoint: string,
  options: ApiOptions<TRequestBody> = {}
): Promise<TResponse> {
  const url = `${BASE_URL}${endpoint}`;
  return fetchWithRetry<TResponse>(url, {
    ...options,
    retryCount: options.retryCount ?? 2,
  });
}
