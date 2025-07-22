"use client";

import { useState } from "react";
import { SearchBoxConfig } from "@/config/common";

import { useSpeechRecognition } from "react-speech-recognition";
import posthog from "posthog-js";

import VoiceSearch from "./VoiceSearch";
import VoiceVisualizer from "./VoiceVisualizer";
import { InputAdornment, TextField, styled } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch: (searchText: string) => void;
}

const CustomField = styled(TextField)({
  "& label.Mui-focused": {
    color: "var(--point)",
    borderRadius: "32px",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "var(--point)",
    borderRadius: "32px",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "var(--point)",
      borderRadius: "32px",
    },
    "&:hover fieldset": {
      borderColor: "var(--point)",
      borderRadius: "32px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--point)",
      borderRadius: "32px",
    },
  },
});

const SearchBar = ({
  className = "",
  placeholder = "검색어를 입력하세요",
  onSearch,
}: SearchBarProps) => {
  const { listening } = useSpeechRecognition();
  const [searchText, setSearchText] = useState("");

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
    <div className={`relative flex items-center ${className}`}>
      <div className="flex-1">
        <CustomField
          fullWidth
          multiline
          maxRows={5}
          placeholder={listening ? "" : placeholder}
          value={listening ? "" : searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
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

      <div
        className={`absolute top-[8px] left-[16px] w-[calc(100%-60px)] ${
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
