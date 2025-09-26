import { NextRequest, NextResponse } from "next/server";

/**
 * 공통 API 요청 핸들러
 */

const getBackendUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_BACKEND_SERVER 환경변수가 설정되지 않았습니다."
    );
  }
  return baseUrl;
};

const addQueryParams = (
  endpoint: string,
  searchParams?: URLSearchParams
): string => {
  if (!searchParams || searchParams.toString() === "") {
    return endpoint;
  }
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}${searchParams.toString()}`;
};

export async function createApiHandler({
  baseUrl = getBackendUrl(),
  endpoint,
  method,
  request,
  transformBody,
}: {
  baseUrl?: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  request: NextRequest;
  transformBody?: (body: unknown) => unknown;
}) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    let body: string | undefined;
    if (method !== "GET") {
      const requestBody = await request.json();
      const processedBody = transformBody
        ? transformBody(requestBody)
        : requestBody;
      body =
        ["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && processedBody
          ? JSON.stringify(processedBody)
          : undefined;
    }

    // URL 파라미터 처리
    const { searchParams } = new URL(request.url);
    const fullEndpoint = addQueryParams(endpoint, searchParams);

    const response = await fetch(`${baseUrl}${fullEndpoint}`, {
      method,
      headers,
      credentials: "include",
      body,
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: `API Error: ${response.status}`, details: responseText },
        { status: response.status }
      );
    }

    if (response.status === 204) {
      return NextResponse.json({});
    }

    const parsed = JSON.parse(responseText);
    return NextResponse.json(parsed.data || parsed);
  } catch (error) {
    console.error(`API ${method} ${endpoint} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * 스트리밍 API 핸들러
 */
export async function createStreamHandler({
  baseUrl = getBackendUrl(),
  endpoint,
  request,
}: {
  baseUrl?: string;
  endpoint: string;
  request: NextRequest;
}) {
  try {
    const body = await request.json();

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-cache",
    });

    if (!response.ok || !response.body) {
      return NextResponse.json(
        {
          error: `스트리밍 응답 실패 (${
            response.status
          }): ${await response.text()}`,
        },
        { status: response.status }
      );
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error(`Stream ${endpoint} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
