"use client";

import { useState } from "react";
import { useDialogStore } from "@/shared/store/useDialogStore";
import { useAlertStore } from "@/shared/store/useAlertStore";

import { Button, IconButton, styled } from "@mui/material";
import Dialog from "../../../shared/components/Dialog";

import FileUploadIcon from "@mui/icons-material/FileUploadOutlined";
import DeleteIcon from "@mui/icons-material/CloseOutlined";
import FileIcon from "@mui/icons-material/DescriptionOutlined";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateProject: () => void;
}

const CreateProjectDialog = ({
  open,
  onClose,
  onCreateProject,
}: CreateProjectDialogProps) => {
  const { openDialog } = useDialogStore();
  const { openAlert } = useAlertStore();

  const [file, setFile] = useState<File | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const handleUploadFile = (file: File | undefined) => {
    if (file) {
      // 파일 크기 체크 (10MB 제한)
      if (file.size > MAX_FILE_SIZE) {
        openAlert({
          message: "파일 크기는 10MB를 초과할 수 없습니다.",
          severity: "error",
          openTime: 3000,
        });
        return;
      }
      setFile(file);
    } else {
      setFile(null);
    }
  };

  const handleDeleteDialog = () => {
    openDialog({
      title: "초안 생성 취소",
      message: "업로드된 파일은 삭제됩니다. 초안 생성을 취소하시겠습니까?",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      onConfirm: () => {
        setFile(null);
        onClose();
      },
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title="새 초안 만들기"
        subtitle="참고 자료로 PDF 파일을 첨부할 수 있습니다 (선택사항)"
        showCloseButton={false}
        disableBackdropClick={true}
        actions={
          <>
            <Button
              onClick={() => (file ? handleDeleteDialog() : onClose())}
              aria-label={
                file
                  ? "취소 (업로드된 파일이 삭제됩니다)"
                  : "취소 (대화상자를 닫습니다)"
              }
            >
              취소
            </Button>
            <Button
              onClick={() => {
                onCreateProject();
                onClose();
              }}
              variant="contained"
              color="primary"
              aria-label="초안 생성 (새로운 초안을 생성하고 상세 페이지로 이동합니다)"
            >
              초안 생성
            </Button>
          </>
        }
      >
        <div className="py-4">
          <fieldset>
            <legend className="mb-2 font-medium">파일 첨부 (PDF만 가능)</legend>
            {!file && (
              <Button
                component="label"
                variant="outlined"
                startIcon={<FileUploadIcon aria-hidden="true" />}
                fullWidth
                aria-describedby="file-upload-description"
              >
                PDF 파일 업로드
                <VisuallyHiddenInput
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(event) =>
                    handleUploadFile(event.target.files?.[0])
                  }
                  aria-label="PDF 파일 선택"
                />
              </Button>
            )}

            {file && (
              <div className="flex items-center justify-between gap-2 border border-gray-200 rounded-md p-2 bg-slate-50">
                <div className="text-sm" role="file-name" aria-live="polite">
                  <FileIcon sx={{ width: 16, height: 16 }} aria-hidden="true" />
                  <span className="ml-2">{file.name}</span>
                </div>
                <IconButton
                  onClick={() => setFile(null)}
                  aria-label="파일 삭제"
                  color="inherit"
                >
                  <DeleteIcon
                    sx={{ width: 16, height: 16 }}
                    aria-hidden="true"
                  />
                </IconButton>
              </div>
            )}
            {file ? (
              <p className="text-xs text-orange-500 mt-2 p-2 bg-yellow-50 rounded-md border border-yellow-300">
                ⚠️ 파일은 한 번만 업로드 가능합니다. 변경하려면 제거 후 다시
                업로드하세요.
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                * PDF 파일은 한 번만 업로드 가능하며, 참고 자료로만 사용됩니다
                (최대 10MB)
              </p>
            )}
          </fieldset>
        </div>
      </Dialog>
    </>
  );
};

export default CreateProjectDialog;
