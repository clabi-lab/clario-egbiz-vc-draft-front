"use client";

import { useEffect, useState, useRef } from "react";
import { useUserStore } from "@/shared/store/useUserStore";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/features/project/store/useProjectStore";

import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import { ProjectEditor } from "../components";

import { createProject, draftChapter, fetchProject } from "../services/project";

import { Chapter } from "../types";

const ProjectDetailPage = () => {
  const params = useParams();
  const projectId = params.id as string;

  const { pdfData, project, setProject, reset } = useProjectStore();
  const { user } = useUserStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 중복 실행 방지를 위한 ref
  const isProcessingRef = useRef(false);
  const prevProjectIdRef = useRef<string | null>(null);

  // 프로젝트가 이미 생성된 경우 리다이렉트
  const redirectToExistingProject = () => {
    if (project?.project_id) {
      router.push(`/project/${project.project_id}`);
      return true;
    }
    return false;
  };

  // 프로젝트 생성 처리
  const handleCreateProject = async (chapters: Chapter[]) => {
    if (project?.project_id) return;

    try {
      const pdfJsonString = pdfData ? JSON.stringify(pdfData) : null;

      const response = await createProject({
        user_id: user?.user_id.toString() ?? "",
        biz_name: user?.company?.name ?? "",
        project_name:
          project?.project_name ??
          `새 프로젝트 ${new Date().toISOString().split("T")[0]}`,
        chapters,
        pdf_yn: !!pdfData,
        pdf_key: pdfData?.task_id ?? "",
        pdf_json: pdfJsonString,
        pdf_processing_json: pdfJsonString,
      });

      router.push(`/project/${response.project_id}`);
    } catch (err) {
      console.error("프로젝트 생성 실패:", err);
      setError("프로젝트 생성에 실패했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  // PDF 데이터를 기반으로 챕터 초안 생성
  const generateChapterDraft = async () => {
    if (redirectToExistingProject() || isProcessingRef.current) return;

    isProcessingRef.current = true;

    try {
      const response = await draftChapter({
        project_name: project?.project_name ?? "",
        user_id: user?.user_id.toString() ?? "",
        biz_name: user?.company?.name ?? "",
        pdf_key: pdfData?.task_id ?? null,
        pdf_json: pdfData,
      });

      const chapters = (response as { items?: Chapter[] }).items ?? [];
      await handleCreateProject(chapters);
    } catch (err) {
      console.error("챕터 초안 생성 실패:", err);
      setError("챕터 초안 생성에 실패했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    } finally {
      isProcessingRef.current = false;
    }
  };

  // 기존 프로젝트 불러오기
  const fetchExistingProject = async () => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    try {
      setIsLoading(true);
      const response = await fetchProject(projectId);

      if (response) {
        setProject(response);
      } else {
        setError("프로젝트를 불러오는데 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("프로젝트 조회 실패:", err);
      setError("프로젝트를 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
      isProcessingRef.current = false;
    }
  };

  // 재시도 핸들러
  const handleRetry = () => {
    if (isProcessingRef.current) return;

    setError(null);
    setIsLoading(true);
    isProcessingRef.current = false; // 재시도를 위해 플래그 리셋
    generateChapterDraft();
  };

  // 프로젝트 초기화
  useEffect(() => {
    // projectId가 변경되지 않았거나 처리 중이면 스킵
    if (prevProjectIdRef.current === projectId || isProcessingRef.current)
      return;

    prevProjectIdRef.current = projectId;
    const isNewProject = projectId === "new";

    if (isNewProject) {
      generateChapterDraft();
    } else {
      fetchExistingProject();
    }

    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // 에러 UI
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 3,
          padding: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleRetry}>
          다시 시도
        </Button>
      </Box>
    );
  }

  // 로딩 UI
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 3,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          프로젝트를 생성하고 있습니다.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          잠시만 기다려주세요
        </Typography>
      </Box>
    );
  }

  return <ProjectEditor />;
};

export default ProjectDetailPage;
