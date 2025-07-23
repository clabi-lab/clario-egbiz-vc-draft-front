"use client";

import { useState } from "react";
import { SearchBoxConfig } from "@/config/common";

import { useSpeechRecognition } from "react-speech-recognition";
import posthog from "posthog-js";

import VoiceSearch from "./VoiceSearch";
import VoiceVisualizer from "./VoiceVisualizer";
import { InputAdornment, TextField, styled } from "@mui/material";

import SendIcon from "@/public/icons/SendIcon";


interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch: (searchText: string) => void;
}

const GradientWrapper = styled("div")({
  padding: "1px",
  borderRadius: "32px",
  background: "linear-gradient(0deg, #005CA4 0%, #CEE2FF 100%)",
});

const InnerField = styled(TextField)({
  borderRadius: "30px",
  backgroundColor: "white",
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "30px",
    backgroundColor: "white",
    padding:"12px",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },

  },
});

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
    <div className={`relative flex items-end ${className} `}>
      <div className="flex-1">
         <GradientWrapper>
          <InnerField           
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
                      <div onClick={() => handleSubmit(searchText)}>
                        <SendIcon />
                      </div>
                    </InputAdornment>
                  ),
                },
              }} />
        </GradientWrapper>
      </div>

      <div
        className={`absolute top-[8px] left-[16px] w-[calc(100%-62px)] ${
          listening ? "" : "hidden"
        }`}
      >
        <VoiceVisualizer />
      </div>

      {SearchBoxConfig.isVoiceSearch && (
        <VoiceSearch onSearch={setSearchText} />
      )}
    </div>
  );
};

export default SearchBar;
