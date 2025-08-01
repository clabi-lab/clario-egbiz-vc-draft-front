"use client";

import { useState } from "react";
import { CommonConfig } from "@/config/common";

import { useSpeechRecognition } from "react-speech-recognition";
import posthog from "posthog-js";

import VoiceSearch from "./VoiceSearch";
import VoiceVisualizer from "./VoiceVisualizer";
import { InputAdornment } from "@mui/material";
import GradientRoundedTextField from "./GradientRoundedTextField";

import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

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
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="flex-1">
        <GradientRoundedTextField
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
          slotProps={{
            input: {
              endAdornment: !listening && (
                <InputAdornment position="end">
                  <SendOutlinedIcon
                    sx={{ cursor: "pointer", color: "var(--point)" }}
                    onClick={() => handleSubmit(searchText)}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      {listening && (
        <div className={`absolute top-[8px] left-[16px] w-[calc(100%-60px)]`}>
          <VoiceVisualizer />
        </div>
      )}

      {CommonConfig.isVoiceSearch && <VoiceSearch onSearch={setSearchText} />}
    </div>
  );
};

export default SearchBar;
