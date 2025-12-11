import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Company {
  name?: string;
  description?: string;
  foundedAt?: string;
  ceo?: string;
  service?: string;
}

export interface User {
  user_id: string;
  company: Company | null;
}

interface UserState {
  user: User | null;
  token: string | null;

  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const parseToken = (token: string): User | null => {
  try {
    const payload = token.split(".")[1];
    // const decoded = JSON.parse(atob(payload));

    // 추후 하드 코딩 제거
    const decoded = {
      user_id: "586-88-02378",
      company: {
        name: "클라비",
        description: "클라비는 컴퓨 및 클라우드서비스를 제공하는 회사입니다.",
        foundedAt: "2022-07-12",
        ceo: "안인구",
        service: "컴퓨 및 클라우드서비스",
      },
    };
    return {
      user_id: decoded.user_id,
      company: decoded.company ?? null,
    };
  } catch {
    return null;
  }
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setToken: (token) => {
        const user = parseToken(token);
        set({ token, user });
      },

      setUser: (user) => set({ user }),

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
