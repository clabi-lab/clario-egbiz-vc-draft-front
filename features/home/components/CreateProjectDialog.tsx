"use client";

import { useState } from "react";
import { useDialogStore } from "@/shared/store/useDialogStore";

import { Button, styled } from "@mui/material";
import Dialog from "../../../shared/components/Dialog";

import FileUploadIcon from "@mui/icons-material/FileUploadOutlined";

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

  const [file, setFile] = useState<File | null>(null);

  const handleUploadFile = (file: File | undefined) => {
    if (file) {
      setFile(file);
    } else {
      setFile(null);
    }
  };

  const handleDeleteDialog = () => {
    openDialog({
      title: "프로젝트 생성 취소",
      message: "업로드된 파일은 삭제됩니다. 프로젝트 생성을 취소하시겠습니까?",
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
        title="새 프로젝트 만들기"
        subtitle="참고 자료로 PDF 파일을 첨부할 수 있습니다 (선택사항)"
        showCloseButton={false}
        disableBackdropClick={true}
        actions={
          <>
            <Button onClick={() => (file ? handleDeleteDialog() : onClose())}>
              취소
            </Button>
            <Button
              onClick={onCreateProject}
              variant="contained"
              color="primary"
            >
              프로젝트 생성
            </Button>
          </>
        }
      >
        <div className="py-4">
          <p className="mb-2">파일 첨부 (PDF만 가능)</p>
          <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<FileUploadIcon />}
            fullWidth
          >
            PDF 파일 업로드
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => handleUploadFile(event.target.files?.[0])}
            />
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            * PDF 파일은 한 번만 업로드 가능하며, 참고 자료로만 사용됩니다
          </p>
        </div>
      </Dialog>
    </>
  );
};

export default CreateProjectDialog;
