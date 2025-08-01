import { create } from "zustand";
import { IndexedDBItem } from "@/types/indexedDB";
import { ChatHistoryItem } from "@/types/Chat";

interface ChatHistoryState {
  histories: ChatHistoryItem[];
  setHistories: (histories: IndexedDBItem[]) => void;
  addHistory: (history: ChatHistoryItem) => void;
}

export const useChatHistoryStore = create<ChatHistoryState>((set) => ({
  histories: [],
  setHistories: (items: IndexedDBItem[]) => {
    const mappedHistories: ChatHistoryItem[] = items.map((item) => ({
      id: item.chatGroupId,
      title: item.title,
    }));
    set({ histories: mappedHistories.reverse() }); // 최신순으로 정렬
  },
  addHistory: (history: ChatHistoryItem) =>
    set((state) => ({ histories: [history, ...state.histories] })),
}));
