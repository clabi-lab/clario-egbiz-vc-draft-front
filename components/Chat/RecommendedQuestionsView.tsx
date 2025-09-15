"use client";

import SafeHTML from "@/lib/SafeHTML";
import type { RecommendedQuestions } from "@/types/Chat";
import { Button } from "@mui/material";

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
    <section
      className={className}
      role="region"
      aria-labelledby="recommended-questions-title"
    >
      <h4 id="recommended-questions-title" className="mb-1">
        🗨️ 추천 질의어
      </h4>
      <ul role="list">
        {questions.map((question, index) => (
          <li
            key={`${question}_${index}`}
            className="border-b border-solid border-gray-300"
          >
            <Button
              sx={{
                justifyContent: "flex-start",
                p: 0,
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#fff",
                },
              }}
              className="text-left focus:outline-none"
              onClick={() => onClick?.(question.question)}
              aria-label={`추천 질문: ${question.question}`}
            >
              <SafeHTML
                html={question.question.replace(/\n/g, "<br />")}
                className="text-[#000] hover:text-[var(--point)] font-normal"
              />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecommendedQuestionsView;
