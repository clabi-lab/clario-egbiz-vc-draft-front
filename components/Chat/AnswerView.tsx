import clsx from "clsx";

import ReactMarkdown from "react-markdown";

type AnswerViewProps = {
  streamText: string;
  className?: string;
};

const AnswerView = ({ streamText, className }: AnswerViewProps) => {
  return (
    <div className={clsx(className, "prose max-w-full")}>
      <ReactMarkdown>{streamText}</ReactMarkdown>
    </div>
  );
};

export default AnswerView;
