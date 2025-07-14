/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { useAiStreaming } from "@/hooks/useAiStreaming";
import { useCreateChatGroup, useFetchSavedChat } from "@/hooks/useChatData";
import { base64Decode } from "@/utils/encoding";
import { useProjectInfoStore } from "@/store/useCommonStore";

import SearchBar from "@/components/SearchBar";
import QuestionView from "@/components/Chat/QuestionView";
import StreamStagesView from "@/components/Chat/StreamStagesView";
import AnswerView from "@/components/Chat/AnswerView";
import RecommendedQuestions from "@/components/Chat/RecommendedQuestions";

import { ChatListItem } from "@/types/Chat";

const ChatDetailPage = ({
  params,
}: {
  params: Promise<{ chatInfo: string }>;
}) => {
  const prompt = useProjectInfoStore((state) => state.prompt);

  const { chatInfo } = use(params);
  const { mutateAsync: fetchSavedChat } = useFetchSavedChat();
  const { mutateAsync: createChatGroup } = useCreateChatGroup();
  const [chatGroupId, setChatGroupId] = useState<number>();

  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");

  const { streamStages, streamText, recommendedQuestions, isFinished } =
    useAiStreaming(chatGroupId, newQuestion);

  const chatWrapRef = useRef<HTMLDivElement>(null);

  const handleCreate = async (title: string) => {
    const chatGroup = await createChatGroup({ title });
    setChatGroupId(chatGroup.chat_group_id);
    setNewQuestion(title);
  };

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
            question: chat.chat_question ?? "",
            streamStages: chat.chat_history_list ?? [],
            streamText: chat.chat_answer ?? "",
            recommendedQuestions: chat.recommended_questions ?? [],
          };
        });
        setChatList(list);
      });
    }
  }, [chatInfo]);

  useEffect(() => {
    // chatList나 newQuestion이 바뀔 때마다 스크롤 맨 아래로 이동
    if (chatWrapRef.current) {
      chatWrapRef.current.scrollTop = chatWrapRef.current.scrollHeight;
    }
  }, [chatList, newQuestion, streamText]);

  const handleSearch = (text: string) => {
    if (!text) return;

    setNewQuestion(text);
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div
        id="chatwrap"
        ref={chatWrapRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {chatList && (
          <>
            {chatList.map((chat, index) => {
              return (
                <div
                  className={index !== 0 ? "mt-10" : ""}
                  key={`${chat.question}_${index}`}
                >
                  {chat.question && (
                    <div className="flex items-center justify-end">
                      <QuestionView type="contained" question={chat.question} />
                    </div>
                  )}
                  {chat.streamStages && (
                    <StreamStagesView
                      className="my-4 border border-gray-300 py-2 px-4 rounded"
                      question={chat.question}
                      streamStages={chat.streamStages}
                      isFinished={true}
                      defaultOpen={false}
                    />
                  )}
                  {chat.streamText && (
                    <AnswerView streamText={chat.streamText} />
                  )}
                  {chat.recommendedQuestions &&
                    chat.recommendedQuestions.length > 0 && (
                      <RecommendedQuestions
                        className="mt-4"
                        questions={chat.recommendedQuestions}
                        onClick={(question) => handleSearch(question)}
                      />
                    )}
                </div>
              );
            })}
          </>
        )}
        {newQuestion && (
          <div className={chatList.length === 0 ? "" : "mt-10"}>
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
            {recommendedQuestions.length > 0 && (
              <RecommendedQuestions
                className="mt-4"
                questions={recommendedQuestions}
                onClick={(question) => handleSearch(question)}
              />
            )}
          </div>
        )}
      </div>

      <SearchBar
        className="mt-4 mx-auto"
        placeholder={prompt.input}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ChatDetailPage;
