import { useState } from "react";
import { getSatisfactionId, updateSatisfactionGroups } from "@/lib/indexedDB";
import { useAlertStore } from "@/store/useAlertStore";

import { updateSatisfaction } from "@/services/chatService";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";

import ChatDislikeIcon from "@/public/icons/ChatDislikeIcon";
import ChatlikeIcon from "@/public/icons/ChatlikeIcon";
import CloseIcon from "@mui/icons-material/Close";

interface FeedBackDialogProps {
  chatId: number;
  activeButton: "like" | "dislike" | null;
  isOpen: boolean;
  onClose: () => void;
}

const FeedBackDialog = ({
  chatId,
  activeButton,
  isOpen,
  onClose,
}: FeedBackDialogProps) => {
  const openAlert = useAlertStore((state) => state.openAlert);

  const [feedBack, setFeedBack] = useState<string>("");

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
        await updateSatisfactionGroups({
          chatGroupId: chatId,
          satisfactionId: res.satisfaction_id,
          memo: feedBack,
          createdDate: new Date().toISOString(),
        });
      }

      setFeedBack("");

      openAlert({
        severity: "success",
        message: "소중한 의견이 전달되었습니다.",
      });
      onClose();
    } catch (error) {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle sx={{ padding: "16px 24px 0" }}>
        {activeButton === "like" ? (
          <div className="flex items-center gap-2">
            <ChatlikeIcon className="w-[24px] h-[24px] text-[24px]" />
            <span>어떤 점이 마음에 들으셨나요?</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ChatDislikeIcon className="w-[24px] h-[24px] text-[24px]" />
            <span>어떤 점이 불편하셨나요?</span>
          </div>
        )}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={7}
          placeholder="페이지 개선을 위해 의견을 남겨주세요."
          size="small"
          value={feedBack}
          onChange={(e) => setFeedBack(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          닫기
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          제출
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedBackDialog;
