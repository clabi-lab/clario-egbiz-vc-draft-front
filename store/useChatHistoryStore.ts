import { create } from "zustand";
import { History } from "../types/ChatHistory";
import { IndexedDBItem } from "@/types/indexedDB";

interface ChatHistoryState {
  histories: History[];
  setHistories: (histories: IndexedDBItem[]) => void;
  addHistory: (history: History) => void;
}

export const useChatHistoryStore = create<ChatHistoryState>((set) => ({
  histories: [],
  setHistories: (items: IndexedDBItem[]) => {
    const mappedHistories: History[] = items.map((item) => ({
      id: item.chatGroupId,
      title: item.title,
    }));
    set({ histories: mappedHistories.reverse() }); // 최신순으로 정렬
  },
  addHistory: (history: History) =>
    set((state) => ({ histories: [...state.histories, history] })),
}));
