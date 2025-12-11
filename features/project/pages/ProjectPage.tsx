"use client";

import { useEffect, useCallback } from "react";

import { ProjectEditor } from "../components";
import { useProjectStore } from "@/features/project/store/useProjectStore";
import { Chapter } from "../types";
import { draftChapter } from "../services/project";
import { useUserStore } from "@/shared/store/useUserStore";

const ProjectPage = () => {
  const { setProject, pdfData, project } = useProjectStore();
  const { user } = useUserStore();

  // PDF 데이터를 기반으로 챕터 초안 생성하는 함수
  const generateChapterDraft = useCallback(async () => {
    if (project?.project_id) return;

    try {
      const response = await draftChapter({
        project_name: project?.project_name || "",
        user_id: user?.user_id.toString() || "0",
        biz_name: user?.company?.company_name || "",
        pdf_key: pdfData?.task_id || "",
        pdf_json: pdfData,
      });

      const chapters = (response as { items?: Chapter[] }).items || [];

      setProject({
        project_name: project?.project_name || "",
        chapters,
      });
    } catch (error) {
      console.error("챕터 초안 생성 실패:", error);
    }
  }, []);

  // PDF 데이터가 있을 때만 챕터 초안 생성
  useEffect(() => {
    generateChapterDraft();
  }, []);

  return <ProjectEditor />;
};

export default ProjectPage;
