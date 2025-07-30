import QuestionView from "@/components/Chat/QuestionView";
import StreamStagesView from "@/components/Chat/StreamStagesView/StreamStagesView";
import AnswerView from "@/components/Chat/AnswerView";
import ReferencesView from "@/components/Chat/ReferencesView";
import RecommendedQuestionsView from "@/components/Chat/RecommendedQuestionsView";

import { RecommendedQuestions, Reference } from "@/types/Chat";
import { StreamStage } from "@/types/Stream";

interface CurrentChatViewProps {
  className?: string;
  question: string;
  streamStages: StreamStage[];
  streamText: string;
  isFinished: boolean;
  references: Reference[];
  recommendedQuestions: RecommendedQuestions[];
  onSearch: (text: string, isRecommend: boolean) => void;
}

const CurrentChatView = ({
  className,
  question,
  streamStages,
  streamText,
  isFinished,
  references,
  recommendedQuestions,
  onSearch,
}: CurrentChatViewProps) => {
  return (
    <div className={className}>
      {question && (
        <div className="flex items-center justify-end">
          <QuestionView type="contained" question={question} />
        </div>
      )}
      {streamStages && (
        <StreamStagesView
          className="my-4 border border-gray-300 py-2 px-4 rounded"
          question={question}
          streamStages={streamStages}
          isFinished={isFinished}
        />
      )}
      {streamText && <AnswerView streamText={streamText} />}
      {references && references.length > 0 && (
        <ReferencesView references={references} className="mt-2" />
      )}
      {recommendedQuestions.length > 0 && (
        <RecommendedQuestionsView
          className="mt-4"
          questions={recommendedQuestions}
          onClick={(question) => onSearch(question, true)}
        />
      )}
    </div>
  );
};

export default CurrentChatView;
