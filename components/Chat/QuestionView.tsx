import clsx from "clsx";
import SafeHTML from "@/lib/SafeHTML";

interface QuestionViewProps {
  question: string;
  type?: "border" | "bold" | "contained";
  className?: string;
}

const QuestionView = ({ question, type, className }: QuestionViewProps) => {
  return (
    <div
      className={clsx(
        className,
        type === "bold" && "text-xl font-bold",
        type === "border" && "px-4 py-1 border rounded-lg border-gray-400",
        type === "contained" && "bg-gray-200 py-2 px-4 rounded inline-block"
      )}
    >
      <SafeHTML html={question.replace(/\n/g, "<br />")} />
    </div>
  );
};

export default QuestionView;
