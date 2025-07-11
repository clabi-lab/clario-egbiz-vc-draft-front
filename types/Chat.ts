export interface ChatGroupResponse {
  chat_group_id: number;
  title: string;
  chats: Chat[];
  created_at: string;
  updated_at: string;
}

export interface Chat {
  chat_question: string;
  chat_answer: string;
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
  references?:
    | {
        referenceType: string;
        referenceContent: string;
      }[]
    | null;
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
  streamStages: {
    type: string;
    text: string;
  }[];
  streamText: string;
  recommendedQuestions?: RecommendedQuestions[];
}

export interface RecommendedQuestions {
  answer: string;
  question: string;
}
