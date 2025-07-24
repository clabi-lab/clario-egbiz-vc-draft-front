import { create } from "zustand";
import { History } from "../types/ChatHistory";

interface ChatHistoryState {
  histories: History[];
  setHistories: (histories: History[]) => void;
  addHistory: (history: History) => void;
}

export const useChatHistoryStore = create<ChatHistoryState>((set) => ({
  histories: [],
  setHistories: (histories) => set({ histories: [...histories].reverse() }),
  addHistory: (history: History) =>
    set((state) => ({ histories: [history, ...state.histories] })),
}));
