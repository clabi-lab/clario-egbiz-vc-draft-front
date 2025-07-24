"use client";

import { use, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAiStreaming } from "@/hooks/useAiStreaming";
import { useFetchSavedChat } from "@/hooks/useChatData";
import { base64Decode } from "@/utils/encoding";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useFetchSetting } from "@/hooks/useHomeData";
import { useAlertStore } from "@/store/useAlertStore";

import SearchBar from "@/components/Common/SearchBar";
import UserActionForm from "@/components/Chat/UserActionForm";
import PastChatsListview from "@/components/Chat/PastChatsListview";
import CurrentChatView from "@/components/Chat/CurrentChatView";

import { createShareCode } from "@/services/chatService";

import { ChatGroupResponse, ChatListItem } from "@/types/Chat";

const ChatDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();

  const queryClient = useQueryClient();
  const { data: settingData } = useFetchSetting();
  const { mutateAsync: fetchSavedChat } = useFetchSavedChat();
  const openAlert = useAlertStore((state) => state.openAlert);

  const [chatGroupId, setChatGroupId] = useState<number>();
  const [pastChats, setPastChats] = useState<ChatListItem[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [isRecommend, setIsRecommend] = useState<boolean>(false);

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
  } = useAiStreaming(chatGroupId, newQuestion, isRecommend);

  const {
    containerRef: chatWrapRef,
    isUserScrolling,
    scrollToBottom,
  } = useAutoScroll<HTMLDivElement>();

  // 초기 마운트 시 처리
  useEffect(() => {
    if (!id) return;

    const init = async () => {
      const groupId = Number(parsed);
      if (isNaN(groupId)) {
        router.push("/not-found");
        return;
      }

      try {
        setChatGroupId(groupId);

        const [shareCodeData, cachedData] = await Promise.all([
          createShareCode(groupId),
          Promise.resolve(
            queryClient.getQueryData<ChatGroupResponse>(["chatGroup", groupId])
          ),
        ]);

        const { chats } = await fetchSavedChat({
          encodedData: shareCodeData.encoded_data,
        });

        setPastChats(
          chats.map((chat) => ({
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

        if (chats.length === 0 && cachedData) {
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

    // 컴포넌트 언마운트 시 스트리밍 중단
    return () => {
      abortStreaming?.();
    };
  }, []);

  // 콘텐츠 변화 시 자동 스크롤
  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [streamStages, newQuestion, streamText]);

  // 새 질문에 대한 응답이 완료되었을 때 실행
  useEffect(() => {
    // 추천 질문 비활성화
    setIsRecommend(false);

    if (!isFinished || !chatGroupId) return;

    // 기존 채팅 목록에 추가
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
    setPastChats((prevChats) => [...prevChats, newChat]);

    // 스트리밍 상태 초기화
    resetStreaming();
    setNewQuestion("");
  }, [isFinished]);

  const decodeAndParse = (data: string) => {
    try {
      const decoded = base64Decode(data);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  };

  // chatInfo를 디코딩하고 파싱하여 유효한 값인지 확인
  const parsed = decodeAndParse(id);
  // 파싱 결과가 유효하지 않으면 not-found 페이지로 리다이렉트
  if (!parsed) {
    router.push(`/not-found`);
    return;
  }

  const handleSearch = (text: string, isRecommend = false) => {
    if (!text || isStreaming) return;

    setIsRecommend(isRecommend);
    setNewQuestion(text);
  };

  return (
    <div className="h-full w-full flex flex-col justify-between relative text-chat-base">
      {!newQuestion && pastChats.length === 0 && (
        <div className="text-lg text-gray-400 absolute top-[50%] left-[50%] translate-[-50%]">
          무엇이든 질문해 주세요
        </div>
      )}
      {/* 스트리밍 중 사용자 액션 영역 */}
      <UserActionForm></UserActionForm>

      <div
        id="chatwrap"
        ref={chatWrapRef}
        className="flex-1 overflow-y-auto p-4"
      >
        <div className="max-w-[800px] m-auto">
          {/* 이전 채팅 목록 */}
          {pastChats.length > 0 && (
            <PastChatsListview chatList={pastChats} onSearch={handleSearch} />
          )}

          {/* 새 질문 응답 영역 */}
          {newQuestion && (
            <CurrentChatView
              className={pastChats.length === 0 ? "" : "mt-10"}
              question={newQuestion}
              streamStages={streamStages}
              streamText={streamText}
              isFinished={isFinished}
              references={references}
              recommendedQuestions={recommendedQuestions}
              onSearch={handleSearch}
            />
          )}
        </div>
      </div>

      <SearchBar
        className="mt-4 mx-auto max-w-[800px] w-full"
        placeholder={settingData.prompt.input}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ChatDetailPage;
