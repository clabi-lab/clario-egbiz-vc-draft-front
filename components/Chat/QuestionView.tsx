import React from "react";
import clsx from "clsx";

type QuestionViewProps = {
  question: string;
  type?: "border" | "bold" | "contained";
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
        type === "border" && "px-4 py-1 border rounded-lg border-gray-400",
        type === "contained" && "bg-gray-200 py-2 px-4 rounded inline-block"
      )}
    >
      {question}
    </div>
  );
};

export default QuestionView;
