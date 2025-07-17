import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retryCount?: number;
}

export const createBaseService = (baseURL?: string) => {
  const instance = axios.create({
    baseURL: baseURL ?? process.env.NEXT_PUBLIC_BACKEND_SERVER,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      // 요청 전 처리 (예: 토큰 첨부) 가능
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 응답 전 처리 (예: 공통 응답 구조 파싱)
      return response.data;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig;

      const shouldRetry = error.response?.status
        ? error.response.status >= 500
        : !error.response;

      originalRequest._retryCount = originalRequest._retryCount ?? 0;

      if (shouldRetry && originalRequest._retryCount < 3) {
        originalRequest._retryCount += 1;
        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));
        await delay(1000);
        return instance(originalRequest);
      }

      // 에러 메시지 가공 예시
      const message = error.message || "알 수 없는 오류가 발생했습니다.";

      console.error("Response error:", message);

      // 필요하면 여기서 toast 등 UI 상태 업데이트로 연결 가능 (권장 X 직접 호출보단)

      return Promise.reject(new Error(message));
    }
  );

  return instance;
};

export const baseService = createBaseService();
