import React from "react";
import clsx from "clsx";

type QuestionViewProps = {
  question: string;
  type?: "border" | "bold";
  className?: string;
};

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  type,
  className,
}) => {
  return (
    <div
      className={clsx(
        className,
        type === "bold" && "text-xl font-bold",
        type === "border" && "px-4 py-1 border rounded-lg border-gray-400"
      )}
    >
      {question}
    </div>
  );
};

export default QuestionView;
