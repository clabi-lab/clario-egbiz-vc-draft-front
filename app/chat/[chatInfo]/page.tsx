"use client";

import { use, useEffect, useRef, useState } from "react";
import { useAiStreaming } from "@/hooks/useAiStreaming";
import { useCreateChatGroup, useFetchSavedChat } from "@/hooks/useChatData";
import { base64Decode } from "@/utils/encoding";
import { useFetchSetting } from "@/hooks/useHomeData";

import SearchBar from "@/components/Common/SearchBar";
import QuestionView from "@/components/Chat/QuestionView";
import StreamStagesView from "@/components/Chat/StreamStagesView";
import AnswerView from "@/components/Chat/AnswerView";
import RecommendedQuestionsView from "@/components/Chat/RecommendedQuestionsView";
import ReferencesView from "@/components/Chat/ReferencesView";
import UserActionForm from "@/components/Chat/UserActionForm";
import PastChatsListview from "@/components/Chat/PastChatsListview";

import { ChatListItem } from "@/types/Chat";

const ChatDetailPage = ({
  params,
}: {
  params: Promise<{ chatInfo: string }>;
}) => {
  const { data: settingData } = useFetchSetting();

  const { chatInfo } = use(params);
  const { mutateAsync: fetchSavedChat } = useFetchSavedChat();
  const { mutateAsync: createChatGroup } = useCreateChatGroup();

  const [chatGroupId, setChatGroupId] = useState<number>();
  const [pastChats, setPastChats] = useState<ChatListItem[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [isRecommend, setIsRecommend] = useState<boolean>(false);

  const {
    streamStages,
    streamText,
    recommendedQuestions,
    references,
    isFinished,
    abortStreaming,
  } = useAiStreaming(chatGroupId, newQuestion, isRecommend);

  const chatWrapRef = useRef<HTMLDivElement>(null);

  // 언마운트 시 스트리밍 중단
  useEffect(() => {
    return () => {
      abortStreaming?.();
    };
  }, []);

  // 초기 마운트 시 처리
  useEffect(() => {
    if (!chatInfo) return;

    try {
      // 새로운 검색으로 접근 시
      const decoded = base64Decode(chatInfo);
      const parsed = JSON.parse(decoded);
      const { title } = parsed;
      handleCreate(title);
    } catch {
      // Chat History에서 접근 시
      fetchSavedChat({ encodedData: chatInfo }).then((data) => {
        setChatGroupId(data.chat_group_id);
        const list = data.chats.map((chat) => {
          return {
            chatId: chat.chat_id ?? undefined,
            question: chat.chat_question ?? "",
            streamStages: chat.chat_history_list ?? [],
            streamText: chat.chat_answer ?? "",
            recommendedQuestions: chat.recommended_questions ?? [],
            references: chat.references ?? [],
          };
        });
        setPastChats(list);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatInfo]);

  // 채팅이 추가되거나 질문이 생기면 자동 스크롤
  useEffect(() => {
    if (chatWrapRef.current) {
      chatWrapRef.current.scrollTop = chatWrapRef.current.scrollHeight;
    }
  }, [pastChats, newQuestion, streamText]);

  const handleCreate = async (title: string) => {
    try {
      const chatGroup = await createChatGroup({ title });
      setChatGroupId(chatGroup.chat_group_id);
      setNewQuestion(title);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (text: string) => {
    if (!text) return;

    setIsRecommend(true);
    setNewQuestion(text);
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {/* 스트리밍 준 사용자 액션 영역 */}
      <UserActionForm></UserActionForm>

      <div
        id="chatwrap"
        ref={chatWrapRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {/* 이전 채팅 목록 */}
        {pastChats.length > 0 && (
          <PastChatsListview chatList={pastChats} onSearch={handleSearch} />
        )}

        {/* 새 질문 응답 영역 */}
        {newQuestion && (
          <div className={pastChats.length === 0 ? "" : "mt-10"}>
            {newQuestion && (
              <div className="flex items-center justify-end">
                <QuestionView type="contained" question={newQuestion} />
              </div>
            )}
            {streamStages && (
              <StreamStagesView
                className="my-4 border border-gray-300 py-2 px-4 rounded"
                question={newQuestion}
                streamStages={streamStages}
                isFinished={isFinished}
              />
            )}
            {streamText && <AnswerView streamText={streamText} />}
            {references && references.length > 0 && (
              <ReferencesView
                references={references}
                className="bg-gray-200 p-2 mt-2"
                onClick={(item) => console.log(item)}
              />
            )}
            {recommendedQuestions.length > 0 && (
              <RecommendedQuestionsView
                className="mt-4"
                questions={recommendedQuestions}
                onClick={(question) => handleSearch(question)}
              />
            )}
          </div>
        )}
      </div>

      <SearchBar
        className="mt-4 mx-auto w-[90%]"
        placeholder={settingData.prompt.input}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ChatDetailPage;
