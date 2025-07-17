"use client";

import { useAlertStore } from "@/store/useAlertStore";

import { Snackbar, Alert } from "@mui/material";

export const GlobalAlert = () => {
  const { isOpen, message, severity, openTime, closeAlert } = useAlertStore();

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={openTime}
      onClose={closeAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} onClose={closeAlert} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
