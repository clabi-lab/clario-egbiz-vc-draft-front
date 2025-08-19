"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useProjectStore } from "@/store/useProjectStore";
import { ProjectInfo } from "@/types/Common";
import { saveIp, sendStatsOnUnload } from "@/services/commonService";
import { getDeviceType } from "@/utils/device";

const AppInitializer = ({ projectinfo }: { projectinfo: ProjectInfo }) => {
  const setProjectInfo = useProjectStore((state) => state.setProjectInfo);
  const setIp = useProjectStore((state) => state.setIp);
  const pathname = usePathname();

  const sendStatsOnTabClose = () => {
    const start = sessionStorage.getItem("sessionStartTime");
    if (!start) return;

    const durationSeconds = Math.floor(
      (Date.now() - new Date(start).getTime()) / 1000
    );
    const segments = pathname.split("/").filter(Boolean);
    const action =
      segments[0] === "chat" && segments[1] ? "chatting" : "main_screen";

    sendStatsOnUnload(durationSeconds, action);
  };

  useEffect(() => {
    // 세션 시작 시간 설정 (새 세션일 때만)
    if (!sessionStorage.getItem("sessionStartTime")) {
      sessionStorage.setItem("sessionStartTime", new Date().toISOString());
    }

    // 탭 종료 감지
    const handleBeforeUnload = () => {
      sendStatsOnTabClose();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // IP 전송
    const sendIp = async () => {
      const deviceType = getDeviceType();
      const data = await saveIp(deviceType);
      setIp(data.ip_address);
    };
    sendIp();
  }, [pathname]);

  useEffect(() => {
    setProjectInfo(projectinfo);
  }, [projectinfo]);

  return null;
};

export default AppInitializer;
