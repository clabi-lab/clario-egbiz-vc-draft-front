import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 인증 필요 페이지는 체크하지 않음
  if (pathname.startsWith("/auth-required")) {
    return NextResponse.next();
  }

  // URL에서 토큰 추출
  const tokenFromQuery = searchParams.get("token");
  const tokenFromHash = request.nextUrl.hash.includes("token=")
    ? new URLSearchParams(request.nextUrl.hash.substring(1)).get("token")
    : null;

  const tokenFromUrl = tokenFromQuery || tokenFromHash;

  // URL에 토큰이 있으면 쿠키에 저장하고 리다이렉트
  if (tokenFromUrl) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("auth-token", tokenFromUrl, {
      httpOnly: false, // 클라이언트에서도 접근 가능하도록 설정
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8시간 (28800초)
      path: "/",
    });

    return response;
  }

  // 쿠키에서 토큰 확인
  const tokenFromCookie = request.cookies.get("auth-token");

  // 토큰이 없으면 인증 필요 페이지로 리다이렉트
  if (!tokenFromCookie) {
    return NextResponse.redirect(new URL("/auth-required", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth-required page
     */
    "/((?!_next/static|_next/image|favicon.ico|auth-required|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
