"use client";

import { useDialogStore } from "../store/useDialogStore";
import CommonDialog from "./CommonDialog";

const GlobalDialog = () => {
  const { confirmDialog, customDialog, closeDialog, closeCustomDialog } =
    useDialogStore();

  return (
    <>
      {/* 기본 확인 다이얼로그 */}
      {confirmDialog.config && (
        <CommonDialog
          open={confirmDialog.isOpen}
          onClose={() => {
            confirmDialog.config?.onCancel?.();
            closeDialog();
          }}
          onConfirm={
            confirmDialog.config.onConfirm
              ? () => {
                  confirmDialog.config?.onConfirm?.();
                  closeDialog();
                }
              : undefined
          }
          title={confirmDialog.config.title}
          message={confirmDialog.config.message}
          confirmButtonText={confirmDialog.config.confirmButtonText || "확인"}
          cancelButtonText={confirmDialog.config.cancelButtonText || "취소"}
          confirmButtonColor={confirmDialog.config.confirmButtonColor}
          showCancelButton={confirmDialog.config.showCancelButton}
          showCloseButton={confirmDialog.config.showCloseButton}
        />
      )}

      {/* 커스텀 다이얼로그들 */}
      {customDialog.config &&
        (() => {
          const CustomComponent = customDialog.config.component;
          return (
            <CustomComponent
              open={customDialog.isOpen}
              onClose={closeCustomDialog}
              {...customDialog.config.props}
            />
          );
        })()}
    </>
  );
};

export default GlobalDialog;
