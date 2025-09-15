"use client";

import AnswerView from "./AnswerView";
import QuestionView from "./QuestionView";
import RecommendedQuestionsView from "./RecommendedQuestionsView";
import ReferencesView from "./ReferencesView";
import StreamStagesView from "./StreamStagesView/StreamStagesView";
import SelectedItemsView from "./SelectedItemsView";

import { ChatListItem } from "@/types/Chat";
import FeedBack from "./FeedBack/FeedBack";

interface PastChatsListviewProps {
  chatList: ChatListItem[];
  onSearch?: (question: string, isRecommend: boolean) => void;
}

const PastChatsListview = ({ chatList, onSearch }: PastChatsListviewProps) => {
  return (
    <section role="log" aria-label="이전 대화 기록" aria-live="polite">
      {chatList && (
        <>
          {chatList.map((chat, index) => {
            return (
              <article
                key={`${chat.question}_${index}`}
                className={index !== 0 ? "mt-12" : ""}
                role="article"
                aria-label={`대화 ${index + 1}`}
              >
                {chat.question && (
                  <div className="flex items-center justify-end">
                    <QuestionView type="contained" question={chat.question} />
                  </div>
                )}

                {chat.selectedItems && chat.selectedItems.length > 0 && (
                  <section aria-label="선택된 항목">
                    <SelectedItemsView
                      className="my-3"
                      selectItems={chat.selectedItems}
                    />
                  </section>
                )}

                {chat.streamStages && (
                  <section aria-label="처리 단계">
                    <StreamStagesView
                      className="my-4 border border-gray-300 py-2 px-4 rounded"
                      question={chat.question}
                      streamStages={chat.streamStages}
                      isFinished={true}
                      defaultOpen={false}
                    />
                  </section>
                )}

                {chat.streamText && (
                  <section aria-label="AI 답변">
                    <AnswerView streamText={chat.streamText} />
                  </section>
                )}

                {chat.references && chat.references.length > 0 && (
                  <section aria-label="참고 자료">
                    <ReferencesView
                      references={chat.references}
                      className="mt-2"
                    />
                  </section>
                )}

                {chat.chatId && (
                  <section aria-label="피드백">
                    <FeedBack
                      streamText={chat.streamText}
                      chatId={chat.chatId}
                    />
                  </section>
                )}

                {chat.recommendedQuestions &&
                  chat.recommendedQuestions.length > 0 && (
                    <section aria-label="추천 질문">
                      <RecommendedQuestionsView
                        className={`mt-6 ${
                          index === chatList.length
                            ? "animate-fade-in-scale [animation-delay:300ms]"
                            : ""
                        }`}
                        questions={chat.recommendedQuestions}
                        onClick={(question) => onSearch?.(question, true)}
                      />
                    </section>
                  )}
              </article>
            );
          })}
        </>
      )}
    </section>
  );
};

export default PastChatsListview;
