import { apiClient } from "@/shared/services/apiClient";

interface Project {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchProjects = async (searchQuery?: string) => {
  const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
  const response = await apiClient<{ data: Project[] }>(`/projects${params}`);
  return response;
};

export const createProject = async (project: Project) => {
  const response = await apiClient("/projects", {
    method: "POST",
    data: project,
  });
  return response;
};

export const deleteProject = async (projectId: string) => {
  const response = await apiClient(`/projects/${projectId}`, {
    method: "DELETE",
  });
  return response;
};

export const copyProject = async (projectId: string) => {
  const response = await apiClient(`/projects/${projectId}/copy`, {
    method: "POST",
  });
  return response;
};
