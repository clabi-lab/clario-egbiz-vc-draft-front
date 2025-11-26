"use client";

import React from "react";
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  fullWidth?: boolean;
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = true,
  showCloseButton = true,
  disableBackdropClick = false,
}) => {
  return (
    <MuiDialog
      open={open}
      onClose={disableBackdropClick ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <div>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="body2" component="div" color="text.secondary">
              {subtitle}
            </Typography>
          </div>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {children && (
        <DialogContent sx={{ pt: title ? 1 : 2 }}>{children}</DialogContent>
      )}

      {actions && (
        <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>
      )}
    </MuiDialog>
  );
};

export default Dialog;
