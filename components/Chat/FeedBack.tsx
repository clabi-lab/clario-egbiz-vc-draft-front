"use client";

import { useState } from "react";
import { getSatisfactionId, saveSatisfactionId } from "@/lib/indexedDB";
import { useAlertStore } from "@/store/useAlertStore";

import { Button, IconButton, InputBase, Menu, Paper } from "@mui/material";

import ChatVoiceIcon from "@/public/icons/ChatVoiceIcon";
import ChatDislikeIcon from "@/public/icons/ChatDislikeIcon";
import ChatlikeIcon from "@/public/icons/ChatlikeIcon";
import ChatCopyIcon from "@/public/icons/ChatCopyIcon";

import { updateSatisfaction } from "@/services/chatService";

interface FeedBackProps {
  streamText: string;
  chatId: number;
}

const FeedBack = ({ streamText, chatId }: FeedBackProps) => {
  const openAlert = useAlertStore((state) => state.openAlert);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeButton, setActiveButton] = useState<"like" | "dislike" | null>(
    null
  );
  const [feedBack, setFeedBack] = useState<string>("");

  const open = Boolean(anchorEl);

  const handleLikeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setActiveButton("like");
  };

  const handleDislikeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setActiveButton("dislike");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveButton(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(streamText);
    openAlert({
      severity: "success",
      message: "클립보드에 복사되었습니다.",
    });
  };

  const handleSubmit = async () => {
    try {
      const satisfactionId = await getSatisfactionId(chatId);

      const res = await updateSatisfaction({
        satisfaction_content: feedBack,
        satisfaction_type: activeButton === "like" ? "LIKE" : "DISLIKE",
        chat_id: chatId,
        ...(satisfactionId && {
          satisfaction_id: satisfactionId,
        }),
      });

      if (res?.satisfaction_id) {
        await saveSatisfactionId({
          chatId,
          satisfactionId: res.satisfaction_id,
        });
      }

      openAlert({
        severity: "success",
        message: "소중한 의견이 전달되었습니다.",
      });
      handleClose();
    } catch (error) {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  return (
    <div className="flex items-center mt-2 gap-1">
      <IconButton sx={{ padding: "2px" }} onClick={handleCopy}>
        <ChatCopyIcon />
      </IconButton>

      <IconButton sx={{ padding: "2px" }} onClick={handleLikeClick}>
        <ChatlikeIcon
          className={open && activeButton === "like" ? "text-point" : ""}
        />
      </IconButton>

      <IconButton sx={{ padding: "2px" }} onClick={handleDislikeClick}>
        <ChatDislikeIcon
          className={open && activeButton === "dislike" ? "text-point" : ""}
        />
      </IconButton>

      {/* <IconButton sx={{ padding: "2px" }}>
        <ChatVoiceIcon />
      </IconButton> */}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            sx: {
              p: 1,
            },
          },
        }}
      >
        <Paper
          component="form"
          sx={{
            p: "4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: 360,
            minWidth: 360,
            boxShadow: "none",
            border: "1px solid #ccc",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <InputBase
            sx={{ flex: 1, px: 1, fontSize: "0.875rem" }}
            placeholder="페이지 개선을 위해 의견을 남겨주세요."
            onChange={(e) => setFeedBack(e.target.value)}
          />
          <Button variant="contained" size="small" type="submit">
            의견 보내기
          </Button>
        </Paper>
      </Menu>
    </div>
  );
};

export default FeedBack;
