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
  clario_uuid?: string;
  ip_address?: string;
  action?: string;
  sub_action?: string;
  use_token_count?: number;
  latency?: number;
  recommended_questions?: string[];
  chat_history_list?: StreamEvent[];
  reference?: {
    referenceType: string;
    referenceContent: string;
  }[];
  images?: {
    imageUrl: string;
    imageType: string;
  }[];
  [key: string]: unknown;
}
