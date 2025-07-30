import { useEffect, useRef, useState } from "react";

import { useChatHistoryStore } from "@/store/useChatHistoryStore";
import { formatChatSaveData } from "@/lib/chatDataFormatter";
import { saveChatGroup } from "@/lib/indexedDB";
import { handleStream } from "@/lib/streamHandler";

import { useUserActionStore } from "@/store/useChatStore";
import { useFilterStore } from "@/store/useFilterStore";

import { saveChat } from "@/services/chatService";

import {
  StreamEndEvent,
  StreamStage,
  UserActionData,
  UserActionFormData,
} from "@/types/Stream";
import { ChatResponse, RecommendedQuestions, Reference } from "@/types/Chat";

/**
 * AI 스트리밍 챗 기능을 위한 커스텀 훅
 * 질문에 따라 서버와 SSE 통신하며 단계별 응답을 받고, 사용자 응답 처리 및 채팅 저장까지 담당
 */
export const useAiStreaming = (
  chatGroupId: number | undefined, // 현재 챗 그룹 ID
  question: string, // 유저가 입력한 질문
  isRecommend?: boolean // 추천 질문인지 여부
) => {
  // 컨트롤러와 스트리밍 단계 누적값은 ref로 관리 (렌더링 영향 없음)
  const controllerRef = useRef<AbortController | null>(null);
  const streamStagesRef = useRef<StreamStage[]>([]);

  // 스토어 및 글로벌 상태 접근
  const histories = useChatHistoryStore((state) => state.histories);
  const addHistory = useChatHistoryStore((state) => state.addHistory);
  const selectedFilters = useFilterStore((state) => state.selectedFilters);

  // 상태값 정의
  const [chatId, setChatId] = useState<number | undefined>(); // 서버에서 저장된 chat ID
  const [streamText, setStreamText] = useState(""); // 실시간 텍스트 응답
  const [streamStages, setStreamStages] = useState<StreamStage[]>([]); // 단계적 응답
  const [recommendedQuestions, setRecommendedQuestions] = useState<
    RecommendedQuestions[]
  >([]); // 추천 질문
  const [selectedItems, setSelectedItems] = useState<string>(""); // 선택된 아이템 정보
  const [references, setReferences] = useState<Reference[]>([]); // 참고자료
  const [isFinished, setIsFinished] = useState(false); // 스트리밍 완료 여부
  const [isStreaming, setIsStreaming] = useState(false); // 현재 스트리밍 중인지 여부
  const [hasError, setHasError] = useState(false); // 오류 발생 여부

  // 질문이 들어오면 스트리밍 시작
  useEffect(() => {
    if (!chatGroupId || !question.trim() || isStreaming) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    setIsStreaming(true);
    setHasError(false);

    // 스트리밍 시작
    startStreaming("c3", { select_items: selectedFilters }, controller.signal);

    // 컴포넌트 언마운트 또는 질문 변경 시 중단
    return () => {
      controller.abort();
      setIsStreaming(false);
    };
  }, [chatGroupId, question]);

  // 서버 스트리밍 핸들러 호출
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

  // 이벤트 수신 핸들러
  const handleStreamingEvent = (event: StreamStage) => {
    if (!event) return;

    switch (event.type) {
      case "main":
      case "sub":
        appendStage(event); // 단계 추가
        break;
      case "response":
        appendText(event.text); // 텍스트 이어쓰기
        break;
    }
  };

  // 단계별 이벤트 저장
  const appendStage = (event: StreamStage) => {
    setStreamStages((prev) => {
      const updated = [...prev, event];
      streamStagesRef.current = updated;
      return updated;
    });
  };

  // 텍스트 응답 이어붙이기
  const appendText = (text: string) => {
    setStreamText((prev) => prev + text);
  };

  // 스트리밍 종료 시 처리
  const handleComplete = async (event: StreamEndEvent) => {
    if (!chatGroupId) return;

    // 유저 액션이 필요한 경우 (form 응답 기다림)
    if (event.form && event.next_endpoint) {
      setStreamText("");
      controllerRef.current?.abort();

      try {
        const userActionData = await waitForUserAction(event.form.category); // 유저 응답 기다리기
        const newController = new AbortController();
        controllerRef.current = newController;
        setIsStreaming(true);

        return startStreaming(
          event.next_endpoint,
          {
            ...userActionData,
            transfer_data: event.transfer_data,
          },
          newController.signal
        );
      } catch (err) {
        console.warn("유저 응답 취소 또는 실패", err);
        return;
      }
    }

    // 다음 엔드포인트가 있는 경우 이어서 스트리밍
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
        },
        newController.signal
      );
    }

    // 스트리밍 완료 저장 처리
    setIsStreaming(false);
    saveChatHistory(event, chatGroupId);
  };

  // 사용자 액션을 기다리는 Promise
  const waitForUserAction = (
    form: UserActionFormData
  ): Promise<UserActionData> => {
    return new Promise((resolve, reject) => {
      useUserActionStore.getState().open(form, resolve, reject);
    });
  };

  // 최종 스트리밍 결과 저장 및 상태 업데이트
  const saveChatHistory = async (
    event: StreamEndEvent,
    chatGroupId: number
  ) => {
    if (event.type === "all" && !event.chat_question) {
      appendText("현재 서비스가 원할하지 못합니다. 서비스팀에 문의해주세요.");
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
    setSelectedItems(chatData.select_items);

    const data: ChatResponse = await saveChat(chatData);
    setChatId(data.chat_id);

    await saveChatGroup({
      chatGroupId: chatGroupId,
      title: question,
      createdDate: new Date().toISOString(),
    });

    // 새 히스토리인 경우 저장
    const hasHistory = await histories.some(
      (history) => history.id === chatGroupId
    );

    if (!hasHistory) {
      await addHistory({
        id: chatGroupId,
        title: question,
      });
    }

    await completeStream();
  };

  // 에러 핸들러
  const handleError = (error: Error) => {
    if (error.name.includes("AbortError")) {
      console.log("스트림이 중단되었습니다."); // 정상 중단
    } else {
      console.error("예상치 못한 에러:", error);
    }

    setHasError(true);
    setIsStreaming(false);
  };

  // 스트리밍 완료 표시
  const completeStream = () => setIsFinished(true);

  // 스트리밍 강제 중단 및 저장
  const abortStreaming = () => {
    controllerRef.current?.abort();

    if (!chatGroupId) return;

    const event: StreamEndEvent = {
      type: "all",
      chat_question: question,
      chat_answer: streamText,
      references,
      chat_id: chatId,
    };

    saveChatHistory(event, chatGroupId);
  };

  // 스트리밍 상태 초기화
  const resetStreaming = () => {
    setStreamStages([]);
    setStreamText("");
    setRecommendedQuestions([]);
    setReferences([]);
    setIsFinished(false);
  };

  // 훅이 반환하는 상태 및 제어 함수
  return {
    chatId,
    streamText,
    streamStages,
    recommendedQuestions,
    references,
    selectedItems,
    isFinished,
    isStreaming,
    hasError,
    abortStreaming,
    resetStreaming,
  };
};
