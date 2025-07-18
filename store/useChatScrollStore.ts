import { create } from "zustand";

export const useChatScrollStore = create<{
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  isProcessesDropdownOpen: boolean;
  setIsProcessesDropdownOpen: (value: boolean) => void;
  scrollToPositon: (scrollTop: number) => void;
  updateScroll: (
    scrollTop: number,
    scrollHeight: number,
    clientHeight: number
  ) => void;
}>((set) => ({
  scrollTop: 0,
  scrollHeight: 0,
  clientHeight: 0,
  isProcessesDropdownOpen: false,
  setIsProcessesDropdownOpen: (value) =>
    set({ isProcessesDropdownOpen: value }),
  scrollToPositon: (scrollTop: number) => set({ scrollTop }),
  updateScroll: (
    scrollTop: number,
    scrollHeight: number,
    clientHeight: number
  ) => set({ scrollTop, scrollHeight, clientHeight }),
}));
