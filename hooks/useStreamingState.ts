import { useRef, useState } from "react";

import type { StreamEvent } from "@/types/Stream";
import type { RecommendedQuestions, Reference } from "@/types/Chat";

export const useStreamingState = () => {
  const [streamText, setStreamText] = useState("");
  const [streamStages, setStreamStages] = useState<StreamEvent[]>([]);
  const [recommendedQuestions, setRecommendedQuestions] = useState<
    RecommendedQuestions[]
  >([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasError, setHasError] = useState(false);

  const streamStagesRef = useRef<StreamEvent[]>([]);

  const appendStage = (event: StreamEvent) => {
    setStreamStages((prev) => {
      const updated = [...prev, event];
      streamStagesRef.current = updated;
      return updated;
    });
  };

  const appendText = (text: string) => {
    setStreamText((prev) => prev + text);
  };

  const completeStream = () => setIsFinished(true);

  return {
    streamText,
    streamStages,
    streamStagesRef,
    recommendedQuestions,
    setRecommendedQuestions,
    references,
    setReferences,
    isFinished,
    appendStage,
    appendText,
    completeStream,
    isStreaming,
    setIsStreaming,
    hasError,
    setHasError,
  };
};
