import { apiClient } from "./apiClient";

import { ProjectInfo } from "@/types/Common";

export const fetchProjectInfo = async (): Promise<ProjectInfo> => {
  return apiClient(`/setting/all`, {
    method: "GET",
  });
};

export const saveIp = async (): Promise<{ message: string }> => {
  return apiClient(`/ip`, {
    method: "POST",
  });
};
