import { Reference } from "./Chat";

export interface StreamEvent {
  type: string;
  text: string;
  [key: string]: unknown;
}

export interface StreamEndEvent {
  type?: string;
  chat_question?: string;
  chat_answer?: string;
  chat_ai_group_id?: number;
  chat_group_id?: number;
  clario_uuid?: string;
  ip_address?: string;
  action?: string;
  sub_action?: string;
  use_token_count?: number;
  latency?: number;
  recommended_questions?: string | string[];
  chat_history_list?: StreamEvent[];
  references?: Reference[];
  images?: {
    imageUrl: string;
    imageType: string;
  }[];
  next_endpoint?: string;
  form?: {
    category: UserActionFormData;
  };
  transfer_data?: unknown[];
  re_select_data?: unknown;
  re_answer_data?: unknown;
  select_items?: unknown[];
  [key: string]: unknown;
}

export interface UserActionFormData {
  type: string;
  items: UserActionFormItem[];
}

export interface UserActionFormItem {
  title: string;
  title_kr: string;
  publication_year: string;
}
export interface UserActionData {
  re_select_data: UserActionFormItem[];
  re_answer_data: string;
}

export interface ChatGroup {
  question: string;
  streamStages: StreamEvent[];
  streamText: string;
  isFinished: boolean;
}
