export class ApiError extends Error {
  status: number;
  body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "잘못된 요청입니다.";
      case 401:
        return "로그인이 필요합니다.";
      case 403:
        return "접근 권한이 없습니다.";
      case 404:
        return "요청한 리소스를 찾을 수 없습니다.";
      case 500:
        return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      default:
        return `오류가 발생했습니다: ${error.message}`;
    }
  }

  if (error instanceof Error) {
    return `에러: ${error.message}`;
  }

  return "알 수 없는 오류가 발생했습니다.";
}
