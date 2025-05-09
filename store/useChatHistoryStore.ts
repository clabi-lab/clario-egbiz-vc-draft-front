import { create } from 'zustand';
import { History } from '../types/ChatHistory';

interface ChatHistoryState {
  histories: History[];
  setHistories: (histories: History[]) => void;
}

export const useChatHistoryStore = create<ChatHistoryState>((set) => ({
  histories: [],
  setHistories: (histories) => set({ histories }),
}));
