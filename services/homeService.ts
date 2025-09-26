import { apiClient } from "@/services/common/apiClient";
import { Filter } from "@/types/Filter";

export const fetchFilters = async (params?: {
  year?: string;
  search?: string;
}): Promise<Filter[]> => {
  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append("year", params.year);
  if (params?.search) queryParams.append("search", params.search);

  const queryString = queryParams.toString();
  const url = queryString ? `/filter?${queryString}` : "/filter";

  return apiClient(url, {
    method: "GET",
  });
};
