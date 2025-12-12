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

export interface DraftChapterResponse {
  pdf_json: string | Record<string, any>;
  pdf_processing_json: string | Record<string, any>;
  items: Chapter[];
}

export interface UpdateChapterRequest {
  chapter_name: string;
  chapter_body: string;
  ai_create_count: number;
  token_count: number;
}

export interface RewriteChapterRequest {
  project_id: number;
  chapter_id: number;
  chapter_name: string;
  confirmed_text: string;
  draft_text: string;
  user_prompt: string;
}

export interface AddChapterRequest {
  project_id: number;
  chapter_name: string;
}

export interface Chapter {
  chapter_id: number;
  chapter_name: string;
  chapter_body: string;
  ai_create_count: number;
  token_count: number;
  created_at: string;
  updated_at: string;
}

// AI 생성 관련 타입
export interface GenerateContentRequest {
  prompt: string;
  chapterTitle?: string;
  chapterContent?: string;
}
