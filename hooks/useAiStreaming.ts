import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useCreateShareCode, useSaveChat } from "@/hooks/useChatData";
import { useChatHistoryStore } from "@/store/useChatHistoryStore";
import { processAiStream } from "@/lib/aiStream";
import { formatChatSaveData } from "@/lib/chatDataFormatter";
import { saveChatGroup } from "@/lib/indexedDB";

import { fetchAiStream } from "@/services/aiStreamService";

import type { StreamEvent, StreamEndEvent } from "@/types/Stream";
import { RecommendedQuestions } from "@/types/Chat";

export const useAiStreaming = (
  chatGroupId: number | undefined,
  question: string
) => {
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  const { addHistory } = useChatHistoryStore();
  const { mutate: saveChat } = useSaveChat();
  const { mutateAsync: createShareCode } = useCreateShareCode();

  const [streamText, setStreamText] = useState("");
  const [streamStages, setStreamStages] = useState<StreamEvent[]>([]);
  const [recommendedQuestions, setRecommendedQuestions] = useState<
    RecommendedQuestions[]
  >([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const streamStagesRef = useRef<StreamEvent[]>([]);

  // chatGroup 생성 완료되면 스트리밍 시작
  useEffect(() => {
    if (!chatGroupId) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetchAiStream(question, chatGroupId, controller.signal)
      .then((stream) =>
        processAiStream(
          stream,
          handleStreamingEvent,
          onStreamingComplete,
          onStreamingError
        )
      )
      .catch((err) => console.error("스트리밍 오류:", err));

    return () => controller.abort();
  }, [question]);

  // 스트리밍 이벤트 처리
  const handleStreamingEvent = (event: StreamEvent) => {
    if (!event || event === undefined) return;

    switch (event.type) {
      case "eventId":
        break;
      case "main":
      case "sub":
        setStreamStages((prev) => {
          const updated = [...prev, event];
          streamStagesRef.current = updated;
          return updated;
        });
        break;
      case "response":
        setStreamText((prev) => prev + event.text);

      default:
        setIsFinished(true);
    }
  };

  // 스트리밍 완료 시 저장 및 라우팅
  const onStreamingComplete = async (event: StreamEndEvent) => {
    if (!chatGroupId) return;

    console.log(event);

    const chatData = formatChatSaveData(
      event,
      chatGroupId,
      streamStagesRef.current
    );

    setRecommendedQuestions(chatData.recommended_questions);

    await saveChat({ chatData });

    const shareCodeData = await createShareCode({
      groupId: chatGroupId,
    });

    await saveChatGroup({
      id: chatGroupId,
      title: question,
      shareCode: shareCodeData.encoded_data,
    }).finally(() => {
      setTimeout(() => {
        router.replace(`/chat/${shareCodeData.encoded_data}`);
      }, 5000);

      addHistory({
        id: chatGroupId,
        title: question,
        shareCode: shareCodeData.encoded_data,
      });
    });
  };

  const onStreamingError = (err: Error) => {
    console.error("❌ 스트리밍 중 오류 발생:", err);
  };

  return {
    streamText,
    streamStages,
    recommendedQuestions,
    isFinished,
  };
};
