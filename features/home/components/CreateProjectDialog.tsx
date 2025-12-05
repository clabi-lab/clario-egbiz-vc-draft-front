"use client";

import { useState } from "react";
import { useDialogStore } from "@/shared/store/useDialogStore";
import { useAlertStore } from "@/shared/store/useAlertStore";

import { Button, IconButton, styled, CircularProgress } from "@mui/material";
import Dialog from "../../../shared/components/Dialog";

import FileUploadIcon from "@mui/icons-material/FileUploadOutlined";
import DeleteIcon from "@mui/icons-material/CloseOutlined";
import FileIcon from "@mui/icons-material/DescriptionOutlined";

import { processPdfWithClaDoc } from "../services/cladoc";

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
  onCreateProject: (pdfData?: any) => void;
}

const CreateProjectDialog = ({
  open,
  onClose,
  onCreateProject,
}: CreateProjectDialogProps) => {
  const { openDialog } = useDialogStore();
  const { openAlert } = useAlertStore();

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [pdfProcessResult, setPdfProcessResult] = useState<any | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const handleUploadFile = async (file: File | undefined) => {
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

      // PDF 파일 형식 체크
      if (!file.type.includes("pdf")) {
        openAlert({
          message: "PDF 파일만 업로드할 수 있습니다.",
          severity: "error",
          openTime: 3000,
        });
        return;
      }

      setFile(file);
      setIsUploading(true);
      setUploadProgress("PDF 파일을 업로드하고 있습니다...");

      try {
        const result = await processPdfWithClaDoc(file, (progressMsg) => {
          setUploadProgress(progressMsg);
        });

        setPdfProcessResult(result);
        setUploadProgress("");

        openAlert({
          message: "PDF 파일이 성공적으로 처리되었습니다.",
          severity: "success",
          openTime: 2000,
        });
      } catch (error) {
        console.error("PDF 처리 오류:", error);
        openAlert({
          message:
            error instanceof Error
              ? error.message
              : "PDF 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
          severity: "error",
          openTime: 3000,
        });
        setFile(null);
        setPdfProcessResult(null);
        setUploadProgress("");
      } finally {
        setIsUploading(false);
      }
    } else {
      setFile(null);
      setPdfProcessResult(null);
      setUploadProgress("");
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
        setPdfProcessResult(null);
        setUploadProgress("");
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
              disabled={isUploading}
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
                onCreateProject(pdfProcessResult || undefined);
                onClose();
              }}
              variant="contained"
              color="primary"
              disabled={isUploading}
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
            {!file && !isUploading && (
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

            {isUploading && (
              <div className="flex flex-col items-center justify-center gap-2 border border-blue-200 rounded-md p-4 bg-blue-50">
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} />
                  <span className="text-sm text-blue-700">
                    {uploadProgress || "PDF 파일을 처리하고 있습니다..."}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  파일 크기에 따라 최대 5분까지 소요될 수 있습니다.
                </p>
              </div>
            )}

            {file && !isUploading && (
              <div className="flex items-center justify-between gap-2 border border-gray-200 rounded-md p-2 bg-slate-50">
                <div className="text-sm" role="file-name" aria-live="polite">
                  <FileIcon sx={{ width: 16, height: 16 }} aria-hidden="true" />
                  <span className="ml-2">{file.name}</span>
                </div>
                <IconButton
                  onClick={() => {
                    setFile(null);
                    setPdfProcessResult(null);
                  }}
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
            {file && !isUploading ? (
              <p className="text-xs text-green-600 mt-2 p-2 bg-green-50 rounded-md border border-green-300">
                ✓ PDF 파일이 성공적으로 처리되었습니다. 변경하려면 제거 후 다시
                업로드하세요.
              </p>
            ) : !isUploading ? (
              <p className="text-xs text-gray-500 mt-2">
                * PDF 파일은 한 번만 업로드 가능하며, 참고 자료로만 사용됩니다
                (최대 10MB)
              </p>
            ) : null}
          </fieldset>
        </div>
      </Dialog>
    </>
  );
};

export default CreateProjectDialog;
