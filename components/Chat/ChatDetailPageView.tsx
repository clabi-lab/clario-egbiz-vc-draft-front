"use client";

import { useEffect } from "react";

import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useChatPageController } from "@/hooks/useChatPageController";
import { useProjectStore } from "@/store/useProjectStore";

import SearchBar from "@/components/Common/SearchBar";
import UserActionForm from "@/components/Chat/UserActionForm";
import PastChatsListview from "@/components/Chat/PastChatsListview";
import CurrentChatView from "@/components/Chat/CurrentChatView";
import ChatNavigation from "@/components/Chat/ChatNavigation";
import ChatActionButton from "@/components/Chat/ChatActionButton";
import { SavedChats } from "@/types/Chat";

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
  const hasInitialChats = initialChatGroupData?.chats?.length > 0;
  const {
    containerRef,
    isUserScrolling,
    showScrollButton,
    scrollToBottom,
    scrollToTop,
  } = useAutoScroll<HTMLDivElement>(isStreaming, hasInitialChats);

  // 콘텐츠 변화 시 자동 스크롤
  useEffect(() => {
    // 초기 채팅 데이터가 있는 경우 자동 스크롤 로직 건너뛰기
    if (hasInitialChats && !newQuestion && !isStreaming) {
      return;
    }

    if (!isUserScrolling) {
      // recommendedQuestions까지 DOM에 그려질 시간을 살짝 기다렸다가 스크롤
      const timeout = setTimeout(() => {
        scrollToBottom();
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [
    streamStages,
    newQuestion,
    streamText,
    references,
    recommendedQuestions,
    scrollToBottom,
    hasInitialChats,
    isStreaming,
  ]);

  const hasPastChats = pastChats.length > 0;

  return (
    <section className="h-full w-full flex flex-col justify-between">
      {/* 상단 네비게이션 영역 */}
      <ChatNavigation isChatHistories={hasPastChats} />

      {/* 메인 채팅 콘텐츠 영역 */}
      <section
        id="chatwrap"
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4"
        role="log"
        aria-live="polite"
        aria-label="채팅 대화 내용"
      >
        <div className="max-w-[640px] m-auto mb-[60px]">
          {/* 응답 중간 유저 액션 UI */}
          <UserActionForm />

          {/* 과거 채팅 목록 렌더링 */}
          {hasPastChats && (
            <section aria-label="이전 대화 기록">
              <PastChatsListview chatList={pastChats} onSearch={handleSearch} />
            </section>
          )}

          {/* 실시간 질문 스트리밍 UI */}
          {newQuestion && (
            <article
              className={pastChats.length === 0 ? "" : "mt-10"}
              aria-label="현재 진행 중인 대화"
            >
              <CurrentChatView
                question={newQuestion}
                streamStages={streamStages}
                streamText={streamText}
                isFinished={isFinished}
                references={references}
                recommendedQuestions={recommendedQuestions}
                onSearch={handleSearch}
              />
            </article>
          )}
        </div>
      </section>

      {/* 하단 입력 영역 */}
      <section className="relative" role="contentinfo">
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
        <div role="search" aria-label="새 질문 입력">
          <SearchBar
            className="md:mx-auto md:max-w-[640px] md:px-0 max-w-full px-2"
            placeholder={projectInfo?.prompt.input}
            onSearch={handleSearch}
          />
        </div>
      </section>
    </section>
  );
};

export default ChatDetailPageView;
