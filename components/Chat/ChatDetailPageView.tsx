"use client";

import { useEffect } from "react";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useChatPageController } from "@/hooks/useChatPageController";

import SearchBar from "@/components/Common/SearchBar";
import UserActionForm from "@/components/Chat/UserActionForm";
import PastChatsListview from "@/components/Chat/PastChatsListview";
import CurrentChatView from "@/components/Chat/CurrentChatView";
import ChatNavigation from "@/components/Chat/ChatNavigation";
import ChatActionButton from "@/components/Chat/ChatActionButton";
import { ChatListItem, SavedChats } from "@/types/Chat";
import { useProjectStore } from "@/store/useProjectStore";

interface ChatDetailPageViewProps {
  initialChatGroupData: SavedChats;
  groupId: number;
}

const ChatDetailPageView = ({
  initialChatGroupData,
  groupId,
}: ChatDetailPageViewProps) => {
  const projectInfo = useProjectStore((state) => state.projectInfo);

  // 채팅 그룹(chatGroupId)에 대한 상태와 로직을 제공하는 커스텀 훅
  const {
    pastChats,
    newQuestion,
    streamStages,
    streamText,
    recommendedQuestions,
    references,
    isStreaming,
    isFinished,
    abortStreaming,
    handleSearch,
  } = useChatPageController(groupId, initialChatGroupData);

  // 자동 스크롤 및 스크롤 위치 감지를 위한 커스텀 훅
  const {
    containerRef,
    isUserScrolling,
    showScrollButton,
    scrollToBottom,
    scrollToTop,
  } = useAutoScroll<HTMLDivElement>();

  // 콘텐츠 변화 시 자동 스크롤
  useEffect(() => {
    if (!isUserScrolling) {
      // recommendedQuestions까지 DOM에 그려질 시간을 살짝 기다렸다가 스크롤
      const timeout = setTimeout(() => {
        scrollToBottom();
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [streamStages, newQuestion, streamText, references, recommendedQuestions]);

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {/* 과거 채팅이 있을 경우 상단 네비게이션 노출 */}
      {pastChats.length > 0 && <ChatNavigation />}

      {/* 채팅 영역: 자동 스크롤 대상 영역 */}
      <div
        id="chatwrap"
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4"
      >
        <div className="max-w-[640px] m-auto mb-[60px]">
          {/* 응답 중간 유저 액션 UI */}
          <UserActionForm />

          {/* 과거 채팅 목록 렌더링 */}
          {pastChats.length > 0 && (
            <PastChatsListview chatList={pastChats} onSearch={handleSearch} />
          )}

          {/* 실시간 질문 스트리밍 UI */}
          {newQuestion && (
            <CurrentChatView
              className={pastChats.length === 0 ? "" : "mt-10"} // 과거 채팅이 있으면 간격 추가
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

      {/* 하단 고정 영역 (버튼 + 검색창) */}
      <div className="relative">
        <ChatActionButton
          isStreaming={isStreaming}
          isUserScrolling={isUserScrolling}
          showScrollButton={showScrollButton}
          onClickStop={() => {
            abortStreaming(); // 스트리밍 중단
          }}
          onClickScroll={() => {
            if (isUserScrolling) {
              scrollToBottom();
            } else {
              scrollToTop();
            }
          }}
        />

        {/* 검색 입력창 */}
        <SearchBar
          className="md:mx-auto md:max-w-[640px] md:px-0 max-w-full px-2"
          placeholder={projectInfo?.prompt.input}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default ChatDetailPageView;
