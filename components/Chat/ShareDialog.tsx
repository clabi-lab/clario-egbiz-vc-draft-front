import { useAlertStore } from "@/store/useAlertStore";
import { base64Decode } from "@/utils/encoding";
import { useParams } from "next/navigation";
import { updateShareChatGroups } from "@/lib/indexedDB";
import { useChatHistoryStore } from "@/store/useChatHistoryStore";

import { createShareCode } from "@/services/chatService";

import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
} from "@mui/material";
import RoundedTextField from "../Common/RoundedTextField";

import InsertLinkIcon from "@mui/icons-material/InsertLink";
import CloseIcon from "@mui/icons-material/Close";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareDialog = ({ isOpen, onClose }: ShareDialogProps) => {
  const params = useParams();
  const chatGroupId = params.chatGroupId;

  const openAlert = useAlertStore((state) => state.openAlert);
  const histories = useChatHistoryStore((state) => state.histories);

  const handleCopy = async () => {
    if (!chatGroupId) return;

    try {
      const parsed = base64Decode(chatGroupId.toString());
      const { encoded_data } = await createShareCode(Number(parsed));
      const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/share/${encoded_data}`;
      await navigator.clipboard.writeText(shareUrl);

      openAlert({
        severity: "success",
        message: "링크가 복사되었습니다.",
      });

      updateIndexedDB(parsed, encoded_data);
    } catch (error) {
      openAlert({
        severity: "error",
        message: `${error} 잠시 후 다시 시도해주세요`,
      });
    }
  };

  const updateIndexedDB = async (chatGroupId: string, encodedData: string) => {
    try {
      const chat = await histories.find(
        (item) => item.id === Number(chatGroupId)
      );

      if (!chat) return;

      await updateShareChatGroups({
        chatGroupId: Number(chatGroupId),
        title: chat.title,
        createdDate: new Date().toISOString(),
        encodedData,
      });
    } catch (error) {
      console.log("IndexedDB 저장 실패");
    }
  };

  const linkPreview = `${process.env.NEXT_PUBLIC_BASE_URL}/share/${chatGroupId}`;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ padding: "16px 24px 0" }}>채팅 링크 공유</DialogTitle>
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
        <DialogContentText>
          대화에 개인정보가 포함되어 있을 수 있습니다. <br />
          링크를 공유하기 전에 내용을 체크하세요.
        </DialogContentText>

        <RoundedTextField
          fullWidth
          disabled
          placeholder="검색어 입력"
          sx={{ mt: 3 }}
          value={linkPreview}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "32px",
                    }}
                    onClick={() => handleCopy()}
                  >
                    <InsertLinkIcon />
                    링크 복사
                  </Button>
                </InputAdornment>
              ),
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
