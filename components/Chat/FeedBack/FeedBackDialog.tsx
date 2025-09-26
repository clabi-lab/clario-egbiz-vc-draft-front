import { useState } from "react";
import { useParams } from "next/navigation";
import {
  getMemoId,
  getSatisfactionId,
  updateMemoGroups,
  updateSatisfactionGroups,
} from "@/lib/indexedDB";
import { useAlertStore } from "@/store/useAlertStore";
import { base64Decode } from "@/utils/encoding";

import {
  addMemo,
  updateMemo,
  updateSatisfaction,
} from "@/services/chatService";

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
import ChatMemoIcon from "@/public/icons/ChatMemoIcon";
import CloseIcon from "@mui/icons-material/Close";

interface FeedBackDialogProps {
  chatId: number;
  activeButton: "like" | "dislike" | "memo" | null;
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
  const params = useParams();
  const chatGroupId = params.chatGroupId;

  const [feedBack, setFeedBack] = useState<string>("");

  const handleSatisfactionSubmit = async () => {
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

      openAlert({
        severity: "success",
        message: "소중한 의견이 전달되었습니다.",
      });

      setFeedBack("");
      onClose();
    } catch (error) {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  const handleMemoSubmit = async () => {
    try {
      const memoId = await getMemoId(chatId);

      const res = memoId
        ? await updateMemo(memoId, feedBack)
        : await addMemo(chatId, feedBack);

      if (chatGroupId) {
        const parsed = base64Decode(chatGroupId.toString());

        await updateMemoGroups({
          chatGroupId: Number(parsed),
          chatId: chatId,
          memoId: res.memo_id,
          memo: feedBack,
          createdDate: new Date().toISOString(),
        });

        openAlert({
          severity: "success",
          message: "메모가 저장되었습니다.",
        });

        setFeedBack("");
        onClose();
      }
    } catch (error) {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  const renderTitle = () => {
    if (activeButton === "like") {
      return (
        <div className="flex items-center gap-2">
          <ChatlikeIcon className="w-[24px] h-[24px] text-[24px]" />
          <span>어떤 점이 마음에 들으셨나요?</span>
        </div>
      );
    } else if (activeButton === "dislike") {
      return (
        <div className="flex items-center gap-2">
          <ChatDislikeIcon className="w-[24px] h-[24px] text-[24px]" />
          <span>어떤 점이 불편하셨나요?</span>
        </div>
      );
    } else if (activeButton === "memo") {
      return (
        <div className="flex items-center gap-2">
          <ChatMemoIcon className="w-[24px] h-[24px] text-[24px]" />
          <span>필요하신 내용을 메모해 보세요.</span>
        </div>
      );
    }
  };

  const inputPlaceholder = () => {
    if (activeButton === "like") {
      return "좋았던 점을 말씀해 주세요.";
    } else if (activeButton === "dislike") {
      return "기능 개선을 위해 의견을 남겨주세요.";
    } else if (activeButton === "memo") {
      return "메모를 입력해 보세요.";
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle sx={{ padding: "16px 24px 0" }}>{renderTitle()}</DialogTitle>
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
          placeholder={inputPlaceholder()}
          size="small"
          value={feedBack}
          onChange={(e) => setFeedBack(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          닫기
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            activeButton === "memo"
              ? handleMemoSubmit()
              : handleSatisfactionSubmit()
          }
          disabled={!feedBack}
        >
          제출
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedBackDialog;
