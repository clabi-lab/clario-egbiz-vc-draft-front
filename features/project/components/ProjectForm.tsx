"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { useAlertStore } from "@/shared/store/useAlertStore";
import { useProjectStore } from "../store/useProjectStore";

import { Button } from "@mui/material";
import { CustomTextField } from "@/shared/components/CustomTextField";
import { ChapterItem } from "./ChapterItem";

import SaveIcon from "@mui/icons-material/SaveOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";

import { updateProject } from "../services/project";
import { createProject } from "../services/project";

import { Chapter } from "../types";
import { useUserStore } from "@/shared/store/useUserStore";

export const ProjectForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { openAlert } = useAlertStore();
  const {
    project,
    addLocalChapter,
    updateProjectTitle,
    setProject,
    pdfData,
    setPdfData,
  } = useProjectStore();
  const { user } = useUserStore();

  const handleUpdateTitle = async (value: string) => {
    try {
      if (project?.project_id) {
        await updateProject(project.project_id, value);
        openAlert({
          message: "문서 제목이 저장되었습니다.",
          severity: "success",
          openTime: 2000,
        });
        return;
      }

      const response = await createProject({
        user_id: user?.user_id || "",
        biz_name: user?.company?.name || "",
        pdf_yn: !!pdfData,
        project_name: value,
        chapters: project?.chapters || [],
        pdf_key: pdfData?.task_id || "",
        pdf_json: pdfData ? JSON.stringify(pdfData) : "",
        pdf_processing_json: "",
      });

      if (response.project_id) {
        router.push(`/project/${response.project_id}`);
        setProject(response);
        // PDF 데이터 사용 완료 후 초기화
        setPdfData(null);
      }

      openAlert({
        message: "문서가 생성되었습니다.",
        severity: "success",
        openTime: 2000,
      });
    } catch (error) {
      console.error("문서 제목 저장 오류:", error);
      openAlert({
        message: "문서 제목 저장 중 오류가 발생했습니다.",
        severity: "error",
        openTime: 3000,
      });
    }
  };

  const handleAddChapter = () => {
    addLocalChapter();
    setTimeout(() => {
      const scrollContainer = formRef.current?.parentElement;
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      handleAddChapter();
    }
  };

  return (
    <form ref={formRef}>
      <fieldset>
        <legend className="text-sm text-gray-500">문서 제목</legend>
        <div className="flex items-center justify-between gap-2">
          <CustomTextField
            className="w-full"
            size="small"
            variant="filled"
            hiddenLabel
            value={project?.project_name || ""}
            onChange={(e) => updateProjectTitle(e.target.value)}
            fullWidth
            slotProps={{
              input: {
                "aria-label": "문서 제목",
              },
            }}
          />
          <Button
            className="flex-shrink-0"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<SaveIcon aria-hidden="true" />}
            aria-label="문서 제목 저장"
            onClick={() => handleUpdateTitle(project?.project_name || "")}
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
          startIcon={<AddIcon aria-hidden="true" />}
          size="small"
          onClick={handleAddChapter}
          onKeyDown={handleKeyDown}
          aria-label="새 챕터 추가"
        >
          챕터 추가
        </Button>
      </div>
      {project?.chapters?.map((chapter: Chapter, index: number) => (
        <ChapterItem
          key={chapter.chapter_id || `temp-${index}`}
          chapter={chapter}
          index={index}
        />
      ))}
    </form>
  );
};
