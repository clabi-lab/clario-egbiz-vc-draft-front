import ModeCommentIcon from "@mui/icons-material/ModeComment";

import type { RecommendedQuestions } from "@/types/Chat";

interface RecommendedQuestionsViewProps {
  questions: RecommendedQuestions[];
  className: string;
  onClick?: (item: string) => void;
}

const RecommendedQuestionsView = ({
  questions,
  className,
  onClick,
}: RecommendedQuestionsViewProps) => {
  return (
    <div className={className}>
      <p className="mb-1">🗨️ 추천 질의어</p>
      {questions.map((question, index) => (
        <div
          key={`${question}_${index}`}
          className="border-b border-solid border-gray-300 py-[3px] cursor-pointer"
          onClick={() => onClick?.(question.question)}
        >
          {question.question}
        </div>
      ))}
    </div>
  );
};

export default RecommendedQuestionsView;
