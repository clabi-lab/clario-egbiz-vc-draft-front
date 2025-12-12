"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth, validateToken } from "@/shared/hooks/useAuth";
import { useUserStore } from "@/shared/store/useUserStore";
import { Box, CircularProgress } from "@mui/material";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { token } = useUserStore();
  const { isInitialized } = useAuth();
  const hasValidatedRef = useRef<string | null>(null);

  // 토큰 유효성 검증 (미들웨어가 이미 존재 여부는 체크함)
  useEffect(() => {
    // auth-required 페이지에서는 토큰 체크 안 함
    if (pathname === "/auth-required") {
      return;
    }

    if (!isInitialized || !token) return;

    // 이미 검증한 토큰은 스킵
    if (hasValidatedRef.current === token) return;

    const isValid = validateToken(token);

    hasValidatedRef.current = token;

    if (!isValid) {
      window.location.reload();
    }
  }, [pathname, token, isInitialized]);

  // 초기화 중이면 로딩 UI 표시
  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return <>{children}</>;
};
