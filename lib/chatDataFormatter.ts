import { StreamEndEvent } from "@/types/Stream";

export const formatChatSaveData = (
  event: StreamEndEvent,
  chatGroupId: number,
  chatHistoryList: { type: string; text: string }[],
  isRecommend?: boolean
) => {
  const {
    ip_address = "",
    chat_question = "",
    chat_answer = "",
    use_token_count = 0,
    latency = 0,
    clario_uuid = 0,
    action = "",
    sub_action = "",
    select_items = [],
    recommended_questions = "[]",
    references = [],
    images = [],
  } = event;

  return {
    ip_address,
    chat_question,
    chat_answer,
    use_token_count,
    latency,
    clario_uuid,
    action: isRecommend ? "recommend" : action,
    sub_action,
    select_items: select_items.join(", "),
    recommended_questions: (typeof recommended_questions === "string"
      ? JSON.parse(recommended_questions)
      : recommended_questions
    ).map((question: string) => ({
      question,
      answer: "",
    })),
    references,
    images,
    chat_history_list: chatHistoryList,
    chat_group_id: chatGroupId,
  };
};
