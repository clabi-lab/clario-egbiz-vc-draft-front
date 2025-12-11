import { apiClient } from "@/shared/services/apiClient";
import {
  ProjectCreateRequest,
  Chapter,
  ProjectDetail,
  DraftChapterRequest,
  RewriteChapterRequest,
  AddChapterRequest,
  UpdateChapterRequest,
} from "../types";

import dayjs from "dayjs";

// Project 관련 API
export const fetchProject = async (project_id: string) => {
  const response = await apiClient<ProjectDetail>(`/project/${project_id}`);
  return response;
};

export const createProject = async (project: ProjectCreateRequest) => {
  const response = await apiClient<ProjectDetail>("/project/create", {
    method: "POST",
    data: project,
  });
  return response;
};

export const updateProject = async (
  project_id: number,
  project_name: string
) => {
  const response = await apiClient(`/project/${project_id}/update`, {
    method: "POST",
    data: {
      project_name: project_name,
    },
  });
  return response;
};

export const downloadProjectDocx = async (
  project_id: number,
  project_name: string
) => {
  try {
    const blob = await apiClient<Blob>(`/project/${project_id}/docx`, {
      method: "GET",
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project_name}_${dayjs().format("YYYYMMDD")}.docx`;

    document.body.appendChild(link);
    link.click();

    // 정리
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("DOCX 다운로드 오류:", error);
    throw error;
  }
};

// Chapter 관련 API
export const createChapter = async (project_id: number, chapter: Chapter) => {
  const response = await apiClient(`/chapter/create`, {
    method: "POST",
    data: { project_id, ...chapter },
  });
  return response;
};

export const updateChapter = async (
  chapter_id: number,
  chapter: UpdateChapterRequest
) => {
  const response = await apiClient(`/chapter/${chapter_id}/update`, {
    method: "POST",
    data: chapter,
  });
  return response;
};

export const deleteChapter = async (chapter_id: number) => {
  const response = await apiClient(`/chapter/${chapter_id}/delete`, {
    method: "POST",
  });
  return response;
};

// AI 통한 챕터 초안 생성
export const draftChapter = async (data: DraftChapterRequest) => {
  const response = await apiClient(`/draft`, {
    method: "POST",
    data: data,
    baseUrl: process.env.NEXT_PUBLIC_CLARIO_SERVER,
  });
  return response;
};

// AI 통한 챕터 재생성
export const rewriteChapter = async (data: RewriteChapterRequest) => {
  const response = await apiClient<{ items: Chapter[] }>(`/rewrite_chapter`, {
    method: "POST",
    data: data,
    baseUrl: process.env.NEXT_PUBLIC_CLARIO_SERVER,
  });
  return response.items;
};

// AI 통한 챕터 추가
export const addChapter = async (data: AddChapterRequest) => {
  const response = await apiClient<{ items: Chapter[] }>(`/add_chapter`, {
    method: "POST",
    data: data,
    baseUrl: process.env.NEXT_PUBLIC_CLARIO_SERVER,
  });
  return response.items;
};
