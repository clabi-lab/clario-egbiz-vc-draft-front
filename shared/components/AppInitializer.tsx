"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const AppInitializer = ({ projectinfo }: { projectinfo: any }) => {
  const pathname = usePathname();

  useEffect(() => {
    // 세션 시작 시간 설정 (새 세션일 때만)
    if (!sessionStorage.getItem("sessionStartTime")) {
      sessionStorage.setItem("sessionStartTime", new Date().toISOString());
    }

    // 탭 종료 감지
    const handleBeforeUnload = () => {
      console.log("beforeunload");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // 초기 설정
  }, [pathname]);

  return null;
};

export default AppInitializer;
