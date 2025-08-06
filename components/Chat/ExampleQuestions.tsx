import { mergeClassNames } from "@/lib/mergeClassNames";
import { useProjectStore } from "@/store/useProjectStore";

interface ExampleQuestionsProps {
  className?: string;
  onSearch: (searchText: string) => void;
}

const ExampleQuestions = ({ className, onSearch }: ExampleQuestionsProps) => {
  const exampleQuestions = useProjectStore(
    (state) => state.projectInfo?.example_questions
  );
  if (!exampleQuestions || exampleQuestions.length === 0) return null;

  return (
    <div className={mergeClassNames(className, "w-full")}>
      {exampleQuestions.map((question) => {
        return (
          <div
            key={question.id}
            className="w-full mb-2 border border-neutral-300 rounded-lg py-2 px-6 text-neutral-500 truncate cursor-pointer"
            onClick={() => {
              onSearch(question.question);
            }}
          >
            📄 {question.question}
          </div>
        );
      })}
    </div>
  );
};

export default ExampleQuestions;
