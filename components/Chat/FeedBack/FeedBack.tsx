"use client";

import { useCallback, useEffect, useState } from "react";
import { useAlertStore } from "@/store/useAlertStore";

import { IconButton } from "@mui/material";
import FeedBackDialog from "./FeedBackDialog";

import ChatVoiceIcon from "@/public/icons/ChatVoiceIcon";
import ChatDislikeIcon from "@/public/icons/ChatDislikeIcon";
import ChatlikeIcon from "@/public/icons/ChatlikeIcon";
import ChatCopyIcon from "@/public/icons/ChatCopyIcon";
import ChatMemoIcon from "@/public/icons/ChatMemoIcon";
import { StopCircleOutlined } from "@mui/icons-material";

interface FeedBackProps {
  streamText: string;
  chatId: number;
  disabled?: boolean;
}

const FeedBack = ({ streamText, chatId, disabled = false }: FeedBackProps) => {
  const openAlert = useAlertStore((state) => state.openAlert);

  const [activeButton, setActiveButton] = useState<
    "like" | "dislike" | "memo" | null
  >(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleLikeClick = () => {
    setActiveButton("like");
    setIsDialogOpen(true);
  };

  const handleDislikeClick = () => {
    setActiveButton("dislike");
    setIsDialogOpen(true);
  };

  const handleMemoClick = () => {
    setActiveButton("memo");
    setIsDialogOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(streamText);
    openAlert({
      severity: "success",
      message: "클립보드에 복사되었습니다.",
    });
  };

  const handleSpeak = useCallback(() => {
    if (!streamText) return;

    window.speechSynthesis.cancel(); // 기존 재생 중단

    const utterance = new SpeechSynthesisUtterance(streamText);
    utterance.lang = "ko-KR";

    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [streamText]);

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div
      className={`flex items-center mt-2 gap-[4px] ${
        disabled ? "pointer-events-none" : ""
      }`}
    >
      <IconButton sx={{ padding: "2px" }} onClick={handleCopy}>
        <ChatCopyIcon />
      </IconButton>

      <IconButton sx={{ padding: "2px" }} onClick={handleLikeClick}>
        <ChatlikeIcon
          className={
            isDialogOpen && activeButton === "like" ? "text-point" : ""
          }
        />
      </IconButton>

      <IconButton sx={{ padding: "2px" }} onClick={handleDislikeClick}>
        <ChatDislikeIcon
          className={
            isDialogOpen && activeButton === "dislike" ? "text-point" : ""
          }
        />
      </IconButton>

      <IconButton sx={{ padding: "2px" }} onClick={handleMemoClick}>
        <ChatMemoIcon />
      </IconButton>

      <IconButton
        sx={{ padding: "2px" }}
        onClick={isSpeaking ? handleStop : handleSpeak}
      >
        {isSpeaking ? (
          <StopCircleOutlined sx={{ fontSize: "20px" }} />
        ) : (
          <ChatVoiceIcon />
        )}
      </IconButton>

      <FeedBackDialog
        chatId={chatId}
        activeButton={activeButton}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default FeedBack;
