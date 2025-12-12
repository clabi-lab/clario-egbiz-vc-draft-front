"use client";

import { useEffect, useState } from "react";
import AlertIcon from "@mui/icons-material/WarningAmberOutlined";

const EXTERNAL_REDIRECT_URL = "https://www.clabi.co.kr/";

export default function AuthRequiredPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 카운트다운 시작
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          window.location.href = EXTERNAL_REDIRECT_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <div className="h-[100vh] flex flex-1 items-center justify-center flex-col bg-gray-600 text-center">
      <AlertIcon
        className="w-[50px] h-[50px] text-white mb-5"
        sx={{ fontSize: 50 }}
      />
      <h2 className={"text-2xl font-extrabold text-white"}>
        로그인이 필요합니다.
      </h2>
      <p className={"text-xl text-white mt-5"}>로그인 후 사용해 주세요.</p>
      <p className={"text-xl text-white mt-2"}>
        {countdown}초 후 로그인 페이지로 이동합니다.
      </p>
    </div>
  );
}
