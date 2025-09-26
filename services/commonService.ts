import { ProjectInfo } from "@/types/Common";
import { serverClient } from "@/services/common/serverService";

export const fetchProjectInfo = async (): Promise<ProjectInfo> => {
  return serverClient<ProjectInfo>("/setting/all", {
    method: "GET",
  });
};

export const saveIp = async (
  deviceType: "mobile" | "desktop"
): Promise<{ created: boolean; ip_address: string }> => {
  return serverClient<{ created: boolean; ip_address: string }>(
    `/ip?device_type=${deviceType}`,
    {
      method: "POST",
    }
  );
};

export const sendStatsOnUnload = (
  session_time: number,
  action: "main_screen" | "chatting"
) => {
  try {
    // sendBeacon을 통한 비동기 전송 (API routes 경유)
    const url = "/api/stats";
    const payload = JSON.stringify({ session_time, action });
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } catch (error) {
    console.error("sendStatsOnUnload 실패:", error);
  }
};
