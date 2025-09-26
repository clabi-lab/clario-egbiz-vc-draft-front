import { StreamStage } from "./Stream";

export interface ChatGroupResponse {
  chat_group_id: number;
  title: string;
  chats: Chat[];
  created_at: string;
  updated_at: string;
}

// ChatResponse는 Chat 타입을 확장하여 필수 필드를 보장
export interface ChatResponse extends Omit<Chat, "chat_group_id" | "chat_id"> {
  chat_group_id: number;
  chat_id: number;
}

// 기본 Reference 인터페이스 - 모든 타입에 공통적으로 필요한 필드
interface BaseReference {
  title: string;
  title_nm: string;
  code: string;
  page_no: string;
  type: string;
  context: string;
  index_code?: string; // list title로 사용
}

// 일반 문서 Reference
export interface DocumentReference extends BaseReference {
  id?: string;
  code_nm?: string;
  publication_year?: string;
  depth1?: string;
  depth2?: string;
  depth3?: string;
  depth4?: string;
  depth5?: string;
  depth1_nm?: string;
  depth2_nm?: string;
  depth3_nm?: string;
  depth4_nm?: string;
  depth5_nm?: string;
  host?: string[];
}

// C1 타입 Reference
interface C1Reference extends BaseReference {
  subject?: string;
  inquery?: string;
  no?: number;
}

// 통합 Reference 타입
export type Reference = DocumentReference | C1Reference;

export interface RecommendedQuestions {
  answer: string;
  question: string;
}

export interface Chat {
  chat_question: string;
  chat_answer: string;
  select_items?: string;
  chat_group_id?: number;
  chat_id?: number;
  chat_ai_group_id?: number;
  created_at?: string;
  updated_at?: string;
  ip_address?: string;
  use_token_count?: number;
  latency?: number;
  action?: string;
  sub_action?: string;
  recommended_questions?: RecommendedQuestions[];
  references?: Reference[];
  images?:
    | {
        imageUrl: string;
        imageType: string;
      }[]
    | null;
  chat_history_list?: {
    type: string;
    text: string;
  }[];
}

export interface ChatListItem {
  question: string;
  streamStages: StreamStage[];
  streamText: string;
  recommendedQuestions?: RecommendedQuestions[];
  references?: Reference[];
  chatId?: number;
  selectedItems?: string[];
}

export interface Satisfaction {
  satisfaction_content: string;
  satisfaction_type: "LIKE" | "DISLIKE";
  chat_id: number;
  satisfaction_id?: number;
}

export interface Memo {
  memo_id: number;
  memo_content: string;
  chat_id: number;
}

export interface ChatHistoryItem {
  id: number | string;
  title: string;
}

export interface SavedChats {
  chat_group_id: number;
  chats: Chat[];
}
