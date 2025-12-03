"use client";

import { useEffect } from "react";

import { ProjectEditor } from "../components";
import { useProjectStore } from "@/features/project/store/useProjectStore";
import { Chapter } from "../types";

const DEFAULT_CHAPTERS: Chapter[] = [
  {
    chapter_id: 0,
    chapter_body: "",
    chapter_name: "기업개요",
    ai_create_count: 0,
  },
  {
    chapter_id: 0,
    chapter_body: "",
    chapter_name: "비전 및 핵심 가치",
    ai_create_count: 0,
  },
  {
    chapter_id: 0,
    chapter_body: "",
    chapter_name: "주요 성과",
    ai_create_count: 0,
  },
];

const ProjectPage = () => {
  const { setProject, reset } = useProjectStore();

  useEffect(() => {
    // 새 프로젝트 생성 시 기본 설정
    setProject({
      project_name: "새 프로젝트",
      chapters: DEFAULT_CHAPTERS,
    });

    return () => {
      reset();
    };
  }, []);

  return <ProjectEditor />;
};

export default ProjectPage;
