import { UserActionFormData, UserActionData } from "@/types/Stream";
import { create } from "zustand";

interface UserActionState {
  form: UserActionFormData | null;
  resolve?: (data: UserActionData) => void;
  reject?: () => void;
  open: (
    form: UserActionFormData,
    resolve: (data: UserActionData) => void,
    reject?: () => void
  ) => void;
  close: () => void;
}

export const useUserActionStore = create<UserActionState>((set) => ({
  form: null,
  resolve: undefined,
  reject: undefined,
  open: (form, resolve, reject) => set({ form, resolve, reject }),
  close: () => set({ form: null, resolve: undefined, reject: undefined }),
}));
