/**
 * 클라이언트 사이드: Next.js API routes 호출 (service 레이어에서 사용)
 */

interface ApiOptions<TRequestBody = unknown> extends Omit<RequestInit, "body"> {
  data?: TRequestBody;
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return {} as T;
  }

  const responseText = await response.text();
  if (!responseText) {
    return {} as T;
  }

  try {
    const parsed = JSON.parse(responseText);
    return parsed.data || parsed;
  } catch {
    return responseText as T;
  }
};

export async function apiClient<TResponse, TRequestBody = unknown>(
  endpoint: string,
  options: ApiOptions<TRequestBody> = {}
): Promise<TResponse> {
  const { data, method = "GET", headers, ...rest } = options;

  const response = await fetch(`/api${endpoint}`, {
    ...rest,
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return parseResponse<TResponse>(response);
}
