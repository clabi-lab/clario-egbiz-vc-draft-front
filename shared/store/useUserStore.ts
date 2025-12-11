import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserCompany {
  company_id: number;
  company_name: string;
  description?: string;
  founded_at?: string;
  ceo?: string;
  service?: string;
}

export interface User {
  user_id: string;
  company: UserCompany | null;
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
    const decoded = JSON.parse(atob(payload));

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
