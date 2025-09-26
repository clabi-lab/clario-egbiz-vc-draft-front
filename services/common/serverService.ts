/**
 * 서버 사이드: 백엔드 직접 호출 (서버 컴포넌트에서 사용)
 */

interface ApiOptions<TRequestBody = unknown> extends Omit<RequestInit, "body"> {
  data?: TRequestBody;
  baseUrl?: string;
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
export async function serverClient<TResponse, TRequestBody = unknown>(
  endpoint: string,
  options: ApiOptions<TRequestBody> = {}
): Promise<TResponse> {
  const {
    data,
    method = "GET",
    headers,
    baseUrl: providedBaseUrl,
    ...rest
  } = options;

  const baseUrl = providedBaseUrl || process.env.NEXT_PUBLIC_BACKEND_SERVER;
  if (!baseUrl) {
    throw new Error(
      "baseUrl 또는 NEXT_PUBLIC_BACKEND_SERVER 환경변수가 설정되지 않았습니다."
    );
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...rest,
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server API Error: ${response.status} - ${errorText}`);
  }

  return parseResponse<TResponse>(response);
}
