"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type AnswerViewProps = {
  streamText: string;
  className?: string;
};

const ANIMATION_THRESHOLD = 5; // 5자 이하면 애니메이션 적용
const CHAR_INTERVAL_MS = 10; // 글자당 지연 시간

const AnswerView = ({ streamText, className }: AnswerViewProps) => {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    if (!streamText) return;

    // 애니메이션 조건 분기
    const animate = streamText.length <= ANIMATION_THRESHOLD;

    if (!animate) {
      setVisibleText(streamText);
      return;
    }

    setVisibleText("");
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setVisibleText(streamText.slice(0, index));
      if (index >= streamText.length) clearInterval(interval);
    }, CHAR_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [streamText]);

  return (
    <div
      className={clsx(
        className,
        "prose max-w-full break-words text-neutral-950"
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {visibleText}
      </ReactMarkdown>
    </div>
  );
};

export default AnswerView;
