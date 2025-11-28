import { create } from "zustand";
import { ComponentType } from "react";

// 기본 확인 다이얼로그 설정
interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success";
  showCancelButton?: boolean;
  showCloseButton?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// 커스텀 다이얼로그 설정
interface CustomDialogConfig {
  component: ComponentType<any>;
  props: { [key: string]: any };
}

interface DialogState {
  // 기본 확인 다이얼로그
  confirmDialog: {
    isOpen: boolean;
    config: ConfirmDialogConfig | null;
  };

  // 커스텀 다이얼로그
  customDialog: {
    isOpen: boolean;
    config: CustomDialogConfig | null;
  };

  // 기본 확인 다이얼로그 메서드
  openDialog: (config: ConfirmDialogConfig) => void;
  closeDialog: () => void;

  // 커스텀 다이얼로그 메서드
  openCustomDialog: (
    component: ComponentType<any>,
    props?: { [key: string]: any }
  ) => void;
  closeCustomDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  confirmDialog: {
    isOpen: false,
    config: null,
  },
  customDialog: {
    isOpen: false,
    config: null,
  },

  // 기본 확인 다이얼로그
  openDialog: (config) =>
    set((state) => ({
      ...state,
      confirmDialog: {
        isOpen: true,
        config,
      },
    })),
  closeDialog: () =>
    set((state) => ({
      ...state,
      confirmDialog: {
        isOpen: false,
        config: null,
      },
    })),

  // 커스텀 다이얼로그
  openCustomDialog: (component, props = {}) =>
    set((state) => ({
      ...state,
      customDialog: {
        isOpen: true,
        config: { component, props },
      },
    })),
  closeCustomDialog: () =>
    set((state) => ({
      ...state,
      customDialog: {
        isOpen: false,
        config: null,
      },
    })),
}));
