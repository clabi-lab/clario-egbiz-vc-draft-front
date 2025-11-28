// Project 관련 타입
export interface Chapter {
  title?: string;
  content?: string;
  draftContent?: string;
}

export interface Company {
  name?: string;
  description?: string;
  foundedAt?: string;
  ceo?: string;
  service?: string;
}

export interface Project {
  id: string;
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  company?: Company | null;
  chapters?: Chapter[] | null;
}

export interface ProjectListItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// AI 생성 관련 타입
export interface GenerateContentRequest {
  prompt: string;
  chapterTitle?: string;
  chapterContent?: string;
}

// Company 관련 타입
export interface CompanyField {
  label: string;
  value?: string;
  fullWidth: boolean;
}
