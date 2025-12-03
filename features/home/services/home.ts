import { apiClient } from "@/shared/services/apiClient";
import { Project } from "../types";

export const fetchProjects = async (searchQuery?: string) => {
  const params = searchQuery
    ? `?searchKeyword=${encodeURIComponent(searchQuery)}`
    : "";
  const response = await apiClient<{
    projects: Project[];
    project_count: number;
  }>(`/project${params}`);

  return {
    data: response.projects || [],
    totalCount: response.project_count || 0,
  };
};

export const deleteProject = async (projectId: string) => {
  const response = await apiClient(`/project/${projectId}/delete`, {
    method: "POST",
  });
  return response;
};

export const copyProject = async (projectId: string) => {
  const response = await apiClient(`/project/${projectId}/copy`, {
    method: "POST",
  });
  return response;
};
