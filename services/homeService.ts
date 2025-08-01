import { apiClient } from "./apiClient";
import { Filter } from "@/types/Filter";

export const fetchFilters = async (params?: {
  year?: string;
  search?: string;
}): Promise<Filter[]> => {
  return apiClient(
    `/chat/filter/tree${params?.search ? `?search=${params?.search}` : ""}`,
    {
      method: "GET",
    }
  );
};
