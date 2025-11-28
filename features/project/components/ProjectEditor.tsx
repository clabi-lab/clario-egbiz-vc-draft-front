"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

import { Button, IconButton, Card, CircularProgress } from "@mui/material";
import { CompanyInfoCard, ChapterItem } from ".";
import { CustomTextField } from "@/shared/components/CustomTextField";
import { useProjectStore } from "@/features/project/store/useProjectStore";
import { useDialogStore } from "@/shared/store/useDialogStore";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";

const ProjectEditor = () => {
  const router = useRouter();
  const chaptersContainerRef = useRef<HTMLDivElement>(null);

  const { openDialog } = useDialogStore();

  const { project, loading, updateProjectTitle, addChapter } =
    useProjectStore();

  const handleBack = () => {
    openDialog({
      title: "페이지 이탈 안내",
      message:
        "페이지에서 나가시면 저장 & 확정되지 않은 정보가 모두 삭제됩니다. <br/> 페이지를 나가시겠습니까?",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      onConfirm: () => {
        router.back();
      },
    });
  };

  const handleDownloadDock = () => {
    console.log("download dock");
  };

  const handleAddChapter = () => {
    addChapter();

    // 새 챕터가 렌더링된 후 맨 아래로 스크롤
    setTimeout(() => {
      if (chaptersContainerRef.current) {
        chaptersContainerRef.current.scrollTo({
          top: chaptersContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
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
      <nav className="p-4 font-bold text-xl border-b border-gray-200">
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

      <div className="flex h-[calc(100svh-69.5px)] relative">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 flex items-center justify-center z-50">
            <CircularProgress size={60} color="primary" />
          </div>
        )}
        <div className="flex-1 overflow-auto p-4" ref={chaptersContainerRef}>
          {project?.company && (
            <CompanyInfoCard companyFields={companyFields} className="mb-4" />
          )}

          <form>
            <fieldset>
              <legend className="text-sm text-gray-500">문서 제목</legend>
              <div className="flex items-center justify-between gap-2">
                <CustomTextField
                  className="w-full"
                  size="small"
                  variant="filled"
                  hiddenLabel
                  value={project?.title || ""}
                  onChange={(e) => updateProjectTitle(e.target.value)}
                  fullWidth
                />
                <Button
                  className="flex-shrink-0"
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<SaveIcon />}
                >
                  저장
                </Button>
              </div>
            </fieldset>

            <div className="flex items-center justify-between gap-2 mt-6">
              <p>챕터 목록</p>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                size="small"
                onClick={handleAddChapter}
              >
                챕터 추가
              </Button>
            </div>
            {project?.chapters?.map((chapter, index) => (
              <ChapterItem
                key={`${chapter.title}-${index}`}
                chapter={chapter}
                index={index}
              />
            ))}
          </form>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-slate-200">
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
        </div>
      </div>
    </section>
  );
};

export default ProjectEditor;
