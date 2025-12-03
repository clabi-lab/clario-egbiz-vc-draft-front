import { apiClient } from "@/shared/services/apiClient";
import {
  GenerateContentRequest,
  ProjectCreateRequest,
  Chapter,
  ProjectDetail,
} from "../types";

export type { GenerateContentRequest };

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

// Chapter 관련 API
export const createChapter = async (project_id: number, chapter: Chapter) => {
  const response = await apiClient(`/chapter/create`, {
    method: "POST",
    data: { project_id, ...chapter },
  });
  return response;
};

export const updateChapter = async (chapter_id: number, chapter: Chapter) => {
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

// AI 스트리밍 생성 (클라이언트에서 직접 fetch를 사용하므로 이 함수는 참고용)
export const generateAIContent = async (
  request: GenerateContentRequest,
  onChunk: (content: string) => void,
  onError: (error: Error) => void,
  onComplete: () => void
) => {
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`AI 생성 실패: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("스트리밍 응답을 받을 수 없습니다.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.content) {
            onChunk(data.content);
          }
          if (data.error) {
            throw new Error(data.error);
          }
        } catch (parseError) {
          console.warn("JSON 파싱 실패:", line);
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error("알 수 없는 오류"));
  }
};
