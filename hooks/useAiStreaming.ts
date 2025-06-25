import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  useCreateChatGroup,
  useCreateShareCode,
  useFetchSavedChat,
  useSaveChat,
} from "@/hooks/useChatData";
import { base64Decode } from "@/utils/encoding";
import { useChatHistoryStore } from "@/store/useChatHistoryStore";
import { processAiStream } from "@/lib/aiStream";
import { formatChatSaveData } from "@/lib/chatDataFormatter";
import { saveChatGroup } from "@/lib/indexedDB";

import { fetchAiStream } from "@/services/aiStreamService";

import type { StreamEvent, StreamEndEvent } from "@/types/Stream";

export const useAiStreaming = (chatInfo: string) => {
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  const { addHistory } = useChatHistoryStore();
  const { mutate: createChatGroup, data: chatGroup } = useCreateChatGroup();
  const { mutate: saveChat } = useSaveChat();
  const { mutateAsync: createShareCode } = useCreateShareCode();
  const { mutateAsync: fetchSavedChat } = useFetchSavedChat();

  const [streamText, setStreamText] = useState("");
  const [streamStages, setStreamStages] = useState<StreamEvent[]>([]);
  const [question, setQuestion] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const streamStagesRef = useRef<StreamEvent[]>([]);

  // 초기 마운트 시 처리
  useEffect(() => {
    if (!chatInfo) return;

    try {
      const decoded = base64Decode(chatInfo);
      const parsed = JSON.parse(decoded);
      const { title } = parsed;
      setQuestion(title);
      createChatGroup({ title });
    } catch {
      fetchSavedChat({ encodedData: chatInfo }).then((data) => {
        console.log(data);
        setIsFinished(true);

        setStreamText(data.chats[0].chat_answer);
        setStreamStages(data.chats[0].chat_history_list ?? []);
        setQuestion(data.chats[0].chat_question);
      });
    }
  }, [chatInfo]);

  // chatGroup 생성 완료되면 스트리밍 시작
  useEffect(() => {
    if (!chatGroup?.chat_group_id || !question) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetchAiStream(question, chatGroup.chat_group_id, controller.signal)
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
  }, [chatGroup?.chat_group_id]);

  // 스트리밍 이벤트 처리
  const handleStreamingEvent = (event: StreamEvent) => {
    if (!event) return;

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
      default:
        setIsFinished(true);
        setStreamText((prev) => prev + event.text);
    }
  };

  // 스트리밍 완료 시 저장 및 라우팅
  const onStreamingComplete = async (event: StreamEndEvent) => {
    if (!chatGroup) return;

    const chatData = formatChatSaveData(
      event,
      chatGroup.chat_group_id,
      streamStagesRef.current
    );
    await saveChat({ chatData });

    const shareCodeData = await createShareCode({
      groupId: chatGroup.chat_group_id,
    });

    await saveChatGroup({
      id: chatGroup.chat_group_id,
      title: question,
      shareCode: shareCodeData.encoded_data,
    });

    addHistory({
      id: chatGroup.chat_group_id,
      title: question,
      shareCode: shareCodeData.encoded_data,
    });

    router.replace(`/chat/${shareCodeData.encoded_data}`);
  };

  const onStreamingError = (err: Error) => {
    console.error("❌ 스트리밍 중 오류 발생:", err);
  };

  // 서치바 핸들러 (추후 확장 가능)
  const handleSearch = (text: string) => {
    console.log(`멀티턴: ${text}`);
  };

  return {
    question,
    streamText,
    streamStages,
    isFinished,
    handleSearch,
  };
};
