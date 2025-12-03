"use client";

import { useRouter } from "next/navigation";

import { Button, IconButton, CircularProgress, Card } from "@mui/material";
import { CompanyInfoCard, ProjectForm, ProjectPreview } from ".";
import { useProjectStore } from "@/features/project/store/useProjectStore";
import { useDialogStore } from "@/shared/store/useDialogStore";
import { useResizer } from "@/features/project/hooks/useResizer";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const ProjectEditor = () => {
  const router = useRouter();

  const { containerRef, leftWidth, handleMouseDown } = useResizer({
    initialWidth: 50,
    minWidth: 20,
    maxWidth: 80,
  });

  const { openDialog } = useDialogStore();

  const { project, loading } = useProjectStore();

  const handleBack = () => {
    openDialog({
      title: "페이지 이탈 안내",
      message:
        "페이지에서 나가시면 저장 & 확정되지 않은 정보가 모두 삭제됩니다. <br/> 페이지를 나가시겠습니까?",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      onConfirm: () => {
        router.push("/");
      },
    });
  };

  const handleDownloadDock = () => {
    console.log("download dock");
  };

  // 기업 정보 필드 정의
  const companyFields = [
    { label: "기업명", value: project?.company?.name, fullWidth: false },
    {
      label: "기업설명",
      value: project?.company?.description,
      fullWidth: false,
    },
    { label: "설립일", value: project?.company?.foundedAt, fullWidth: false },
    { label: "대표자", value: project?.company?.ceo, fullWidth: false },
    { label: "서비스", value: project?.company?.service, fullWidth: true },
  ];

  return (
    <section>
      <nav
        className="p-4 font-bold text-xl border-b border-gray-200"
        aria-label="프로젝트 에디터 네비게이션"
      >
        <div className="flex items-center justify-between">
          <IconButton onClick={handleBack} aria-label="목록으로 돌아가기">
            <ArrowBackIcon sx={{ width: 20, height: 20 }} aria-hidden="true" />
          </IconButton>
          <Button
            variant="contained"
            startIcon={
              <FileDownloadIcon
                sx={{ width: 16, height: 16 }}
                aria-hidden="true"
              />
            }
            onClick={handleDownloadDock}
            aria-label="DOCK 다운로드"
          >
            DOCK 다운로드
          </Button>
        </div>
      </nav>

      <div
        className="flex h-[calc(100svh-69.5px)] relative overflow-hidden"
        ref={containerRef}
      >
        {loading && (
          <div
            className="absolute top-0 left-0 w-full h-full bg-white opacity-50 flex items-center justify-center z-50"
            role="status"
            aria-live="polite"
          >
            <CircularProgress size={60} color="primary" aria-label="로딩 중" />
          </div>
        )}
        <div
          className="overflow-auto p-4"
          style={{ width: `${leftWidth}%`, flexShrink: 0 }}
        >
          {project?.company && (
            <CompanyInfoCard companyFields={companyFields} className="mb-4" />
          )}

          <ProjectForm />
        </div>

        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0 relative group"
          style={{ zIndex: 10 }}
          role="separator"
          aria-label="패널 너비 조정"
          aria-orientation="vertical"
          aria-valuenow={leftWidth}
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4" />
        </div>

        <div
          className="overflow-auto p-4 bg-slate-200"
          style={{ width: `${100 - leftWidth}%`, flexShrink: 0 }}
        >
          <Card
            className="border border-blue-300 p-4"
            sx={{
              boxShadow: "none",
              borderRadius: "16px",
              backgroundColor: "#eff4ff",
            }}
          >
            A4 용지 미리보기
            <p>실제 출력 시 모습을 미리 확인할 수 있습니다</p>
          </Card>
          <ProjectPreview className="mt-4" />
        </div>
      </div>
    </section>
  );
};

export default ProjectEditor;
