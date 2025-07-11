import { create } from "zustand";

interface ChatProcessesDropdownState {
  isProcessesDropdownOpen: boolean;
  setIsProcessesDropdownOpen: (value: boolean) => void;
}

export const useChatProcessesDropdownStore = create<ChatProcessesDropdownState>(
  (set) => ({
    isProcessesDropdownOpen: false,
    setIsProcessesDropdownOpen: (value) =>
      set({ isProcessesDropdownOpen: value }),
  })
);
