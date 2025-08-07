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
    <div
      className={mergeClassNames(
        className,
        "flex flex-wrap md:inline-flex w-full"
      )}
    >
      {exampleQuestions.map((question) => {
        return (
          <div
            key={question.id}
            className="m-1 border border-neutral-300 rounded-lg px-4 py-2 text-neutral-500 truncate cursor-pointer text-sm w-full md:w-auto"
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
