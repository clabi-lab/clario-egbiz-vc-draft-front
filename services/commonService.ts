import { apiClient } from "./apiClient";

import { ProjectInfo } from "@/types/Common";

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
