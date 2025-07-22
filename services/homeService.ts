import { Filter } from "@/types/Filter";
import { baseService } from "./baseService";
import { Setting } from "@/types/Home";

export const fetchSetting = async (): Promise<Setting> => {
  const response = await baseService.get(`/setting/all`);
  return response.data;
};

export const fetchFilters = async (params?: {
  year?: string;
  search?: string;
}): Promise<Filter[]> => {
  const response = await baseService.get("/chat/filter/tree", {
    params,
  });
  return response.data;
};
