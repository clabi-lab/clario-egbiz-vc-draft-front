import { create } from "zustand";

interface ChatState {
  isProcessesDropdownOpen: boolean;
  setIsProcessesDropdownOpen: (value: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isProcessesDropdownOpen: false,
  setIsProcessesDropdownOpen: (value) =>
    set({ isProcessesDropdownOpen: value }),
}));
