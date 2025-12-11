// Project 관련 타입
export interface Company {
  name?: string;
  description?: string;
  foundedAt?: string;
  ceo?: string;
  service?: string;
}

export interface CompanyField {
  label: string;
  value?: string;
  fullWidth: boolean;
}

export interface ProjectListItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail {
  project_name: string;

  project_id?: number;
  pdf_key?: string;
  pdf_json?: string | null;
  pdf_processing_json?: string | null;
  chapters?: Chapter[];
  updated_at?: string;
  user_id?: number;
  company?: Company;
}

export interface ProjectCreateRequest {
  user_id: string;
  biz_name: string;
  pdf_yn: boolean;

  project_name?: string;
  pdf_key?: string;
  pdf_json?: string | null;
  pdf_processing_json?: string | null;
  chapters?: Chapter[];

  company?: Company;
}

// Chapter 관련 타입
export interface DraftChapterRequest {
  project_name: string;
  user_id: string;
  biz_name: string;
  pdf_key: string | null;
  pdf_json: any;
}

export interface UpdateChapterRequest {
  chapter_name: string;
  chapter_body: string;
  ai_create_count: number;
  token_count: number;
}

export interface RewriteChapterRequest {
  project_name: string;
  user_id: string;
  biz_name: string;
  project_id: string;
  chapter_id: number;
  chapter_name: string;
  generation_count: number;
  user_prompt: string;
}

export interface AddChapterRequest {
  project_name: string;
  user_id: string;
  biz_name: string;
  project_id: string;
  chapter_name: string;
}

export interface Chapter {
  chapter_id: number;
  chapter_body: string;
  chapter_name: string;
  ai_create_count: number;
  draftContent?: string;
  created_at?: string;
  updated_at?: string;
  token_count?: number;
}

// AI 생성 관련 타입
export interface GenerateContentRequest {
  prompt: string;
  chapterTitle?: string;
  chapterContent?: string;
}
