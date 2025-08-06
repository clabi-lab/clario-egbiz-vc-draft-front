import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAiStreaming } from "@/hooks/useAiStreaming";
import { useAlertStore } from "@/store/useAlertStore";
import { useProjectStore } from "@/store/useProjectStore";

import type { ChatGroupResponse, ChatListItem, SavedChats } from "@/types/Chat";

/**
 * 공유된 chatGroupIdEncoded를 기반으로 채팅 데이터를 가져오고,
 * AI 스트리밍을 제어하며, 질문 처리 및 상태 관리를 수행하는 컨트롤러 훅
 */
export const useChatPageController = (
  groupId: number,
  initialChatGroupData: SavedChats
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const openAlert = useAlertStore((state) => state.openAlert);
  const projectInfo = useProjectStore((state) => state.projectInfo);

  const [pastChats, setPastChats] = useState<ChatListItem[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [isRecommend, setIsRecommend] = useState<boolean>(false); // 추천 질문 여부

  /**
   * 페이지 진입 시 디코딩된 groupId를 확인하고
   * 캐시/서버에서 초기 채팅 데이터를 로드
   */
  useEffect(() => {
    if (!groupId) return;

    if (isNaN(groupId)) {
      router.push("/not-found");
      return;
    }

    const init = async () => {
      try {
        // 캐시 데이터 가져오기
        const cachedData = await queryClient.getQueryData<ChatGroupResponse>([
          "chatGroup",
          groupId,
        ]);

        // 채팅 이력을 포맷팅 후 상태로 저장
        setPastChats(
          initialChatGroupData?.chats.map((chat) => ({
            chatId: chat.chat_id ?? undefined,
            question: chat.chat_question ?? "",
            streamStages: chat.chat_history_list ?? [],
            streamText: chat.chat_answer ?? "",
            recommendedQuestions: chat.recommended_questions ?? [],
            references: chat.references ?? [],
            selectedItems: chat.select_items
              ? chat.select_items
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
          }))
        );

        // 새로운 질문이 없다면 title을 초기 질문으로 설정
        if (initialChatGroupData.chats.length === 0 && cachedData) {
          setNewQuestion(cachedData.title);
        }
      } catch (error) {
        openAlert({
          severity: "error",
          message: "잠시 후 다시 시도해주세요",
        });
        router.push("/chat");
      }
    };

    init();
  }, [groupId]);

  // AI 스트리밍 훅 사용
  const {
    chatId,
    streamStages,
    streamText,
    recommendedQuestions,
    references,
    selectedItems,
    isStreaming,
    isFinished,
    abortStreaming,
    resetStreaming,
  } = useAiStreaming(groupId, newQuestion, isRecommend);

  /**
   * AI 응답이 완료되면 새로운 채팅을 pastChats에 추가
   * 이후 스트리밍 상태 초기화
   */
  useEffect(() => {
    setIsRecommend(false); // 초기화

    // 스트리밍이 끝나지 않았거나 잘못된 그룹 ID일 경우 무시
    if (!isFinished || !groupId) return;

    const newChat: ChatListItem = {
      chatId: chatId,
      question: newQuestion,
      streamStages,
      streamText,
      recommendedQuestions,
      references,
      selectedItems: selectedItems
        ? selectedItems
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };

    setPastChats((prev) => [...prev, newChat]); // 이전 채팅 목록에 추가
    resetStreaming(); // 스트리밍 상태 초기화
    setNewQuestion(""); // 입력 필드 초기화
  }, [
    isFinished,
    chatId,
    newQuestion,
    streamStages,
    streamText,
    recommendedQuestions,
    references,
    selectedItems,
    resetStreaming,
    groupId,
  ]);

  /**
   * 검색 또는 추천 질문 클릭 시 실행되는 핸들러
   */
  const handleSearch = (text: string, isRec: boolean = false) => {
    if (!text || isStreaming) return;

    setIsRecommend(isRec);
    setNewQuestion(text);
  };

  return {
    projectInfo, // 사용자 설정
    pastChats, // 이전 채팅 목록
    newQuestion, // 현재 입력 중인 질문
    streamStages, // 스트리밍 단계별 결과
    streamText, // 전체 응답 텍스트
    recommendedQuestions, // 추천 질문 목록
    references, // AI 응답 참조 자료
    selectedItems, // 선택된 항목들
    isStreaming, // 현재 스트리밍 중인지 여부
    isFinished, // 스트리밍 완료 여부
    abortStreaming, // 스트리밍 중단 함수
    resetStreaming, // 스트리밍 초기화 함수
    handleSearch, // 질문 실행 함수
  };
};
