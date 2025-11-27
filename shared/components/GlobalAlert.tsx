"use client";

import { useAlertStore } from "@/shared/store/useAlertStore";

import { Snackbar, Alert } from "@mui/material";

export const GlobalAlert = () => {
  const { isOpen, message, severity, openTime, closeAlert } = useAlertStore();

  // 심각도에 따른 역할 및 레이블 정의
  const getAlertAttributes = () => {
    switch (severity) {
      case "error":
        return {
          role: "alert",
          ariaLive: "assertive" as const,
          closeLabel: "오류 알림 닫기",
        };
      case "warning":
        return {
          role: "alert",
          ariaLive: "polite" as const,
          closeLabel: "경고 알림 닫기",
        };
      case "success":
        return {
          role: "status",
          ariaLive: "polite" as const,
          closeLabel: "성공 알림 닫기",
        };
      default:
        return {
          role: "status",
          ariaLive: "polite" as const,
          closeLabel: "알림 닫기",
        };
    }
  };

  const alertAttributes = getAlertAttributes();

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={openTime}
      onClose={closeAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      aria-live={alertAttributes.ariaLive}
    >
      <Alert
        severity={severity}
        onClose={closeAlert}
        role={alertAttributes.role}
        sx={{ width: "100%" }}
        slotProps={{
          closeButton: {
            "aria-label": alertAttributes.closeLabel,
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
