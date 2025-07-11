import { create } from "zustand";

export const useChatScrollStore = create<{
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
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
  scrollToPositon: (scrollTop: number) => set({ scrollTop }),
  updateScroll: (
    scrollTop: number,
    scrollHeight: number,
    clientHeight: number
  ) => set({ scrollTop, scrollHeight, clientHeight }),
}));
