// store/useAlertStore.ts
import { create } from "zustand";

type AlertSeverity = "success" | "info" | "warning" | "error";

interface AlertState {
  isOpen: boolean;
  message: string;
  severity: AlertSeverity;
  openTime: number; // ms 단위
  resolve: (() => void) | null;
  openAlert: (options: {
    message: string;
    severity: AlertSeverity;
    openTime?: number;
  }) => Promise<void>;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  isOpen: false,
  message: "",
  severity: "info",
  openTime: 3000,
  resolve: null,

  openAlert: ({ message, severity, openTime = 3000 }) => {
    set({ isOpen: true, message, severity, openTime });
    return new Promise<void>((resolve) => {
      set({ resolve });
    });
  },

  closeAlert: () => {
    const { resolve } = get();
    if (resolve) {
      resolve();
    }
    set({ isOpen: false, resolve: null });
  },
}));
