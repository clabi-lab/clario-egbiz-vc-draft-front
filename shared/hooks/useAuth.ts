"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/shared/store/useUserStore";
import { parseJWT } from "@/shared/utils/jwt";

/**
 * 쿠키에서 토큰 읽기
 */
const getTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((c) => c.trim().startsWith("auth-token="));

  if (tokenCookie) {
    return tokenCookie.split("=")[1];
  }

  return null;
};

/**
 * 인증 상태를 관리하는 훅
 */
export const useAuth = () => {
  const { user, token, setToken, logout } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 쿠키에서 토큰 읽기
    const cookieToken = getTokenFromCookie();

    if (cookieToken && cookieToken !== token) {
      setToken(cookieToken);
    }

    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isInitialized,
    logout,
  };
};

/**
 * 토큰 유효성 검증
 */
export const validateToken = (token: string): boolean => {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return false;
    }

    const payload = parseJWT<{ exp?: number }>(token);

    if (!payload) {
      return false;
    }

    // 만료 시간 체크
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < now;

      if (isExpired) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("❌ 토큰 검증 중 오류:", error);
    return false;
  }
};
