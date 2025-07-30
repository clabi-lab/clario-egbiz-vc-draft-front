import AnswerView from "./AnswerView";
import FeedBack from "./FeedBack";
import QuestionView from "./QuestionView";
import RecommendedQuestionsView from "./RecommendedQuestionsView";
import ReferencesView from "./ReferencesView";
import StreamStagesView from "./StreamStagesView/StreamStagesView";
import SelectedItemsView from "./SelectedItemsView";

import { ChatListItem } from "@/types/Chat";

interface PastChatsListviewProps {
  chatList: ChatListItem[];
  onSearch?: (question: string, isRecommend: boolean) => void;
}

const PastChatsListview = ({ chatList, onSearch }: PastChatsListviewProps) => {
  return (
    <>
      {chatList && (
        <>
          {chatList.map((chat, index) => {
            return (
              <div
                className={index !== 0 ? "mt-12 text-inherit" : "text-inherit"}
                key={`${chat.question}_${index}`}
              >
                {chat.question && (
                  <div className="flex items-center justify-end">
                    <QuestionView type="contained" question={chat.question} />
                  </div>
                )}
                {chat.selectedItems && chat.selectedItems.length > 0 && (
                  <SelectedItemsView
                    className="my-4"
                    selectItems={chat.selectedItems}
                  />
                )}
                {chat.streamStages && (
                  <StreamStagesView
                    className="my-4 border border-gray-300 py-3 px-6 rounded"
                    question={chat.question}
                    streamStages={chat.streamStages}
                    isFinished={true}
                    defaultOpen={false}
                  />
                )}
                {chat.streamText && <AnswerView streamText={chat.streamText} />}
                {chat.references && chat.references.length > 0 && (
                  <ReferencesView
                    references={chat.references}
                    className="mt-2"
                  />
                )}
                {chat.chatId && (
                  <FeedBack streamText={chat.streamText} chatId={chat.chatId} />
                )}

                {chat.recommendedQuestions &&
                  chat.recommendedQuestions.length > 0 && (
                    <RecommendedQuestionsView
                      className="mt-8"
                      questions={chat.recommendedQuestions}
                      onClick={(question) => onSearch?.(question, true)}
                    />
                  )}
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default PastChatsListview;
