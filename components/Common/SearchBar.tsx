"use client";

import { useState } from "react";
import { CommonConfig } from "@/config/common";

import { useSpeechRecognition } from "react-speech-recognition";
import posthog from "posthog-js";

import VoiceSearch from "./VoiceSearch";
import VoiceVisualizer from "./VoiceVisualizer";
import { InputAdornment } from "@mui/material";
import GradientRoundedTextField from "./GradientRoundedTextField";

import SendIcon from "@/public/icons/SendIcon";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch: (searchText: string) => void;
}

const SearchBar = ({
  className = "",
  placeholder = "검색어를 입력하세요",
  onSearch,
}: SearchBarProps) => {
  const { listening } = useSpeechRecognition();
  const [searchText, setSearchText] = useState<string>("");

  const handleSubmit = (value: string) => {
    if (!value) return;

    // PostHog로 검색 이벤트 트래킹
    posthog.capture("searched_keyword", {
      keyword: value,
      source: "search_input",
    });

    onSearch(value);
    setSearchText("");
  };

  return (
    <form
      className={`relative flex items-end w-full overflow-hidden ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(searchText);
      }}
      role="search"
      aria-label="질문 검색"
    >
      <div className="flex-1">
        <label htmlFor="search-input" className="sr-only">
          질문을 입력하세요
        </label>
        <GradientRoundedTextField
          id="search-input"
          fullWidth
          multiline
          maxRows={5}
          placeholder={listening ? "" : placeholder}
          value={listening ? "" : searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(searchText);
            }
          }}
          aria-label="질문 입력"
          aria-describedby={listening ? "voice-status" : undefined}
          slotProps={{
            input: {
              endAdornment: !listening && (
                <InputAdornment position="end">
                  <button
                    type="submit"
                    onClick={() => handleSubmit(searchText)}
                    aria-label="질문 전송"
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <SendIcon />
                  </button>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      {listening && (
        <div className={`absolute top-[8px] left-[16px] w-[calc(100%-62px)]`}>
          <div id="voice-status" aria-live="polite" className="sr-only">
            음성 인식 중입니다
          </div>
          <VoiceVisualizer />
        </div>
      )}

      {CommonConfig.isVoiceSearch && <VoiceSearch onSearch={setSearchText} />}
    </form>
  );
};

export default SearchBar;
