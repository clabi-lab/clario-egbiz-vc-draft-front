import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseJWT } from "@/shared/utils/jwt";

export const EXTERNAL_REDIRECT_URL = "https://www.clabi.co.kr/";

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
  const decoded = parseJWT<{ user_id: string; company: Company }>(token);
  if (!decoded) return null;

  return {
    user_id: decoded.user_id,
    company: decoded.company ?? null,
  };
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

      logout: () => {
        // 쿠키에서도 토큰 제거
        if (typeof document !== "undefined") {
          document.cookie =
            "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: "user-storage",
      storage: {
        getItem: (name) => {
          // sessionStorage 사용 - 탭/브라우저 닫으면 자동 삭제
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
