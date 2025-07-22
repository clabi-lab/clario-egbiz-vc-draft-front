import { create } from "zustand";

export const useChatScrollStore = create<{
  isProcessesDropdownOpen: boolean;
  setIsProcessesDropdownOpen: (value: boolean) => void;
}>((set) => ({
  isProcessesDropdownOpen: false,
  setIsProcessesDropdownOpen: (value) =>
    set({ isProcessesDropdownOpen: value }),
}));
