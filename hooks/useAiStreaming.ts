import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useCreateShareCode, useSaveChat } from "@/hooks/useChatData";
import { useChatHistoryStore } from "@/store/useChatHistoryStore";
import { formatChatSaveData } from "@/lib/chatDataFormatter";
import { saveChatGroup } from "@/lib/indexedDB";
import { handleStream } from "@/lib/streamHandler";
import { useStreamingState } from "./useStreamingState";

import {
  StreamEndEvent,
  StreamEvent,
  UserActionData,
  UserActionFormData,
} from "@/types/Stream";
import { useUserActionStore } from "@/store/useChatStore";
import { useFilterStore } from "@/store/useFilterStore";

export const useAiStreaming = (
  chatGroupId: number | undefined,
  question: string,
  isRecommend?: boolean
) => {
  const router = useRouter();
  const controllerRef = useRef<AbortController | null>(null);

  const addHistory = useChatHistoryStore((state) => state.addHistory);
  const selectedFilters = useFilterStore((state) => state.selectedFilters);

  const { mutate: saveChat } = useSaveChat();
  const { mutateAsync: createShareCode } = useCreateShareCode();

  const {
    streamText,
    setStreamText,
    streamStages,
    streamStagesRef,
    recommendedQuestions,
    setRecommendedQuestions,
    references,
    setReferences,
    isFinished,
    completeStream,
    appendStage,
    appendText,
    isStreaming,
    setIsStreaming,
    hasError,
    setHasError,
  } = useStreamingState();

  useEffect(() => {
    if (!chatGroupId) return;
    if (!question.trim()) return;

    if (isStreaming) {
      // 이미 스트리밍 중이면 중복 호출 방지
      console.warn("중복 스트리밍 요청 방지");
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setIsStreaming(true);
    setHasError(false);

    startStreaming("c3", { select_items: selectedFilters }, controller.signal);

    return () => {
      controller.abort();
      setIsStreaming(false);
    };
  }, [chatGroupId, question]);

  const abortStreaming = () => {
    controllerRef.current?.abort();
    // 상태 초기화 등도 여기서 처리
  };

  const startStreaming = async (
    endpoint: string,
    extraData: Record<string, unknown>,
    signal: AbortSignal
  ) => {
    try {
      await handleStream({
        endpoint,
        question,
        chatGroupId: chatGroupId!,
        extraData,
        signal,
        onEvent: handleStreamingEvent,
        onComplete: handleComplete,
        onError: handleError,
      });
    } catch (err) {
      handleError(err as Error);
    }
  };

  const handleStreamingEvent = (event: StreamEvent) => {
    if (!event) return;

    switch (event.type) {
      case "main":
      case "sub":
        appendStage(event);
        break;
      case "response":
        appendText(event.text);
        break;
    }
  };

  const handleComplete = async (event: StreamEndEvent) => {
    setIsStreaming(false);

    if (!chatGroupId) return;

    if (event.form && event.next_endpoint) {
      setStreamText("");
      controllerRef.current?.abort();

      // 유저 응답을 기다리는 Promise 생성
      try {
        const userActionData = await waitForUserAction(event.form.category);

        const newController = new AbortController();
        controllerRef.current = newController;
        setIsStreaming(true);

        return startStreaming(
          event.next_endpoint,
          {
            ...userActionData, // 유저가 선택한 값 전달
            transfer_data: event.transfer_data,
            re_select_data: event.re_select_data,
            reAnswerData: event.re_answer_data,
          },
          newController.signal
        );
      } catch (err) {
        console.warn("유저 응답 취소 또는 실패", err);
        return;
      }
    }

    if (event.next_endpoint) {
      setStreamText("");
      controllerRef.current?.abort();

      const newController = new AbortController();
      controllerRef.current = newController;
      setIsStreaming(true);

      return startStreaming(
        event.next_endpoint,
        {
          transfer_data: event.transfer_data,
          re_select_data: event.re_select_data,
          reAnswerData: event.re_answer_data,
        },
        newController.signal
      );
    }

    saveChatHistory(event, chatGroupId);
    completeStream();
  };

  const waitForUserAction = (
    form: UserActionFormData
  ): Promise<UserActionData> => {
    return new Promise((resolve, reject) => {
      useUserActionStore.getState().open(form, resolve, reject);
    });
  };

  const saveChatHistory = async (
    event: StreamEndEvent,
    chatGroupId: number
  ) => {
    if (event.type === "all" && !event.chat_question) {
      appendText(
        event.chat_question ||
          "현재 서비스가 원할하지 못합니다. 서비스팀에 문의해주세요."
      );

      return;
    }

    const chatData = formatChatSaveData(
      event,
      chatGroupId,
      streamStagesRef.current,
      isRecommend
    );

    setRecommendedQuestions(chatData.recommended_questions);
    setReferences(chatData.references);

    await saveChat({ chatData });

    setTimeout(async () => {
      const shareCodeData = await createShareCode({ groupId: chatGroupId });

      await saveChatGroup({
        id: chatGroupId,
        title: question,
        shareCode: shareCodeData.encoded_data,
      });

      router.replace(`/chat/${shareCodeData.encoded_data}`);
      addHistory({
        id: chatGroupId,
        title: question,
        shareCode: shareCodeData.encoded_data,
      });
    }, 2000);
  };

  const handleError = (error: Error) => {
    if (error.name.includes("AbortError")) {
      // 스트림 중단에 따른 정상 에러이므로 무시
      console.log("스트림이 중단되었습니다.");
    } else {
      console.error("예상치 못한 에러:", error);
    }

    setHasError(true);
    setIsStreaming(false);
  };

  return {
    streamText,
    streamStages,
    recommendedQuestions,
    references,
    isFinished,
    isStreaming,
    hasError,
    abortStreaming,
  };
};
