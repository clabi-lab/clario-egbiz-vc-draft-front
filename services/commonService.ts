import { apiClient } from "./apiClient";

import { ProjectInfo } from "@/types/Common";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER;

export const fetchProjectInfo = async (): Promise<ProjectInfo> => {
  return apiClient(`/setting/all`, {
    method: "GET",
  });
};

export const saveIp = async (
  deviceType: "mobile" | "desktop"
): Promise<{ created: boolean; ip_address: string }> => {
  return apiClient(`/ip?device_type=${deviceType}`, {
    method: "POST",
  });
};

export const sendStatsOnUnload = (
  session_time: number,
  action: "main_screen" | "chatting"
) => {
  try {
    const url = `${BASE_URL}/stats`;
    const payload = JSON.stringify({ session_time, action });
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } catch (error) {
    console.error("sendStatsOnUnload 실패:", error);
  }
};
