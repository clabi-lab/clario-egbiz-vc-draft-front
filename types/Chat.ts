import { StreamStage } from "./Stream";

export interface ChatGroupResponse {
  chat_group_id: number;
  title: string;
  chats: Chat[];
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  chat_question: string;
  chat_answer: string;
  chat_group_id: number;
  chat_id: number;
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

export interface Reference {
  id: string;
  type: string;
  index_code: string;
  title: string;
  title_nm: string;
  text: string;
  publication_year: string;
  page_no: string;
  code: string;
  host: string[];
  [key: string]: unknown;
}

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
