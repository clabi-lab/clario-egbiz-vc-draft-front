import { baseService } from "./baseService";

export const saveIp = async (): Promise<{ message: string }> => {
  const response = await baseService.post(`/ip`);
  return response.data.message;
};
