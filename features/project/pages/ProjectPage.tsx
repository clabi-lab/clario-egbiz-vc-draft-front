"use client";

import { useEffect } from "react";

import { ProjectEditor } from "../components";
import { useProjectStore } from "@/features/project/store/useProjectStore";

const DEFAULT_CHAPTERS = [
  {
    title: "기업개요",
    content: "",
    draftContent: "",
  },
  {
    title: "비전 및 핵심 가치",
    content: "",
    draftContent: "",
  },
  {
    title: "주요 성과",
    content: "",
    draftContent: "",
  },
];

const ProjectPage = () => {
  const { setProject, reset } = useProjectStore();

  useEffect(() => {
    // 새 프로젝트 생성 시 기본 설정
    setProject({
      id: "",
      title: "새 프로젝트",
      chapters: DEFAULT_CHAPTERS,
      company: {
        name: "",
        description: "",
        foundedAt: "",
        ceo: "",
        service: "",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return () => {
      reset();
    };
  }, []);

  return <ProjectEditor />;
};

export default ProjectPage;
