export interface Company {
  name?: string;
  description?: string;
  foundedAt?: string;
  ceo?: string;
  service?: string;
}

export interface ProjectDetail {
  project_name: string;

  project_id?: number;
  pdf_key?: string;
  pdf_json?: string;
  pdf_processing_json?: string;
  chapters?: Chapter[];
  updated_at?: string;
  user_id?: number;
  company?: Company;
}

export interface ProjectCreateRequest {
  user_id: number;
  biz_name: string;
  pdf_yn: boolean;

  project_name?: string;
  pdf_key?: string;
  pdf_json?: string;
  pdf_processing_json?: string;
  chapters?: Chapter[];

  company?: Company;
}

export interface Chapter {
  chapter_id: number;
  chapter_body: string;
  chapter_name: string;
  ai_create_count: number;
  draftContent?: string;
  created_at?: string;
  updated_at?: string;
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
