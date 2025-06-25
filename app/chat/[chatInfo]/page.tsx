"use client";

import { use } from "react";
import { useFetchPromptInput } from "@/hooks/useHomeData";
import { useAiStreaming } from "@/hooks/useAiStreaming";

import SearchBar from "@/components/SearchBar";
import QuestionView from "@/components/Chat/QuestionView";
import StreamStagesView from "@/components/Chat/StreamStagesView";
import AnswerView from "@/components/Chat/AnswerView";

const ChatDetailPage = ({
  params,
}: {
  params: Promise<{ chatInfo: string }>;
}) => {
  const { chatInfo } = use(params);
  const { data: promptInputData } = useFetchPromptInput();

  const { question, streamStages, streamText, isFinished, handleSearch } =
    useAiStreaming(chatInfo);

  return (
    <div className="h-full w-full flex flex-col justify-between overflow-y-auto">
      <div>
        <QuestionView type="bold" question={question} />
        <StreamStagesView
          className="my-4"
          streamStages={streamStages}
          isFinished={isFinished}
        />
        <AnswerView streamText={streamText} />
      </div>
      <SearchBar
        className="mt-8 mx-auto"
        placeholder={promptInputData.input}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ChatDetailPage;
