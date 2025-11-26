interface ApiOptions<TRequestBody = unknown> extends Omit<RequestInit, "body"> {
  data?: TRequestBody;
  baseUrl?: string;
  retries?: number; // 재시도 횟수 (기본값: 3)
  retryDelay?: number; // 첫 재시도 대기 시간(ms, 기본값: 1000)
  signal?: AbortSignal; // 요청 취소를 위한 signal
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

// 재시도 가능한 HTTP 상태 코드
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// 재시도 대기 함수 (지수 백오프)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function serverClient<TResponse, TRequestBody = unknown>(
  endpoint: string,
  options: ApiOptions<TRequestBody> = {}
): Promise<TResponse> {
  const {
    data,
    method = "GET",
    headers,
    baseUrl: providedBaseUrl,
    retries = 3,
    retryDelay = 1000,
    signal,
    ...rest
  } = options;

  const baseUrl = providedBaseUrl || process.env.NEXT_PUBLIC_BACKEND_SERVER;
  if (!baseUrl) {
    throw new Error(
      "baseUrl 또는 NEXT_PUBLIC_BACKEND_SERVER 환경변수가 설정되지 않았습니다."
    );
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...rest,
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        cache: rest.cache || "no-store",
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(
          `Server API Error: ${response.status} - ${errorText}`
        );

        // 재시도 가능한 상태 코드인지 확인
        if (
          attempt < retries &&
          RETRYABLE_STATUS_CODES.includes(response.status)
        ) {
          lastError = error;
          // 지수 백오프: 대기 시간을 2배씩 증가
          const waitTime = retryDelay * Math.pow(2, attempt);
          console.warn(
            `재시도 ${
              attempt + 1
            }/${retries} - ${waitTime}ms 후 재시도합니다. 상태 코드: ${
              response.status
            }`
          );
          await delay(waitTime);
          continue;
        }

        throw error;
      }

      return parseResponse<TResponse>(response);
    } catch (error) {
      // AbortError는 재시도하지 않고 즉시 throw
      if ((error as Error).name === "AbortError") {
        throw error;
      }

      // 네트워크 오류 등 fetch 자체가 실패한 경우
      if (attempt < retries) {
        lastError = error as Error;
        const waitTime = retryDelay * Math.pow(2, attempt);
        console.warn(
          `재시도 ${
            attempt + 1
          }/${retries} - ${waitTime}ms 후 재시도합니다. 오류: ${
            (error as Error).message
          }`
        );
        await delay(waitTime);
        continue;
      }

      throw error;
    }
  }

  // 모든 재시도가 실패한 경우
  throw lastError || new Error("요청이 실패했습니다.");
}
