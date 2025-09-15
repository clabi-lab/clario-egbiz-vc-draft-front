import clsx from "clsx";
import SafeHTML from "@/lib/SafeHTML";

interface QuestionViewProps {
  question: string;
  type?: "border" | "bold" | "contained";
  className?: string;
}

const QuestionView = ({ question, type, className }: QuestionViewProps) => {
  // type에 따른 role 결정
  const getRole = () => {
    if (type === "bold") return "heading";
    return "region";
  };

  const getAriaLevel = () => {
    if (type === "bold") return 3; // h3 level heading
    return undefined;
  };

  return (
    <section
      className={clsx(
        className,
        type === "bold" && "text-xl font-bold",
        type === "border" && "px-4 py-1 border rounded-lg border-gray-400",
        type === "contained" && "bg-gray-200 py-2 px-4 rounded inline-block"
      )}
      role={getRole()}
      aria-level={getAriaLevel()}
      aria-label={type === "bold" ? "주요 질문" : "사용자 질문"}
    >
      <SafeHTML html={question.replace(/\n/g, "<br />")} />
    </section>
  );
};

export default QuestionView;
