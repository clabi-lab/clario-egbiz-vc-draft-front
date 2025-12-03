"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success";
  showCancelButton?: boolean;
  showCloseButton?: boolean;
}

const CommonDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "확인",
  cancelButtonText = "취소",
  confirmButtonColor = "primary",
  showCancelButton = true,
  showCloseButton = true,
}: CommonDialogProps) => {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "16px",
        }}
      >
        <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {showCloseButton && (
          <IconButton
            aria-label="대화상자 닫기"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon aria-hidden="true" />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ paddingBottom: "24px" }}>
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </DialogContent>

      <DialogActions sx={{ padding: "0 24px 24px 24px", gap: "8px" }}>
        {showCancelButton && (
          <Button
            onClick={onClose}
            color="inherit"
            aria-label={`${cancelButtonText} - 대화상자를 닫습니다`}
          >
            {cancelButtonText}
          </Button>
        )}
        {onConfirm && (
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={confirmButtonColor}
            aria-label={`${confirmButtonText} - 작업을 확인하고 실행합니다`}
          >
            {confirmButtonText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialog;
