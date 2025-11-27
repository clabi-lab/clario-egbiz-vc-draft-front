"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";

import {
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);

      // 임시 초안 데이터
      const mockProject: Project = {
        id: projectId,
        title: `초안 ${projectId}`,
        description:
          "이것은 초안에 대한 상세 설명입니다. 여기에 초안의 목적, 범위, 주요 기능 등을 설명할 수 있습니다.",
        status: "draft",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-15T10:30:00Z",
      };

      // API 호출 시뮬레이션
      setTimeout(() => {
        setProject(mockProject);
        setLoading(false);
      }, 500);
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/version/${projectId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "default";
      case "in_progress":
        return "primary";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography>초안을 찾을 수 없습니다.</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          className="mt-4"
        >
          돌아가기
        </Button>
      </Container>
    );
  }

  return (
    <section>
      <nav className="p-4 font-bold text-xl border-b border-gray-200">
        <Container maxWidth="lg" className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              variant="text"
              color="inherit"
            >
              돌아가기
            </Button>
            <Typography variant="h6" component="h1">
              초안 상세
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            편집하기
          </Button>
        </Container>
      </nav>

      <Container maxWidth="lg" className="py-8">
        <Paper
          elevation={0}
          className="p-8 border border-gray-200"
          sx={{ borderRadius: "16px" }}
        >
          <Box className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h4" component="h2" className="font-bold">
                {project.title}
              </Typography>
              <Chip
                color={getStatusColor(project.status) as any}
                variant="outlined"
              />
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <CalendarIcon sx={{ width: 16, height: 16 }} />
                <span>
                  생성일: {dayjs(project.createdAt).format("YYYY년 MM월 DD일")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon sx={{ width: 16, height: 16 }} />
                <span>
                  수정일:{" "}
                  {dayjs(project.updatedAt).format("YYYY년 MM월 DD일 HH:mm")}
                </span>
              </div>
            </div>

            <Divider className="mb-6" />

            {project.description && (
              <div className="mb-6">
                <Typography variant="h6" className="mb-3 font-semibold">
                  초안 설명
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-700 leading-relaxed"
                >
                  {project.description}
                </Typography>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                size="large"
              >
                편집하기
              </Button>
              <Button variant="outlined" onClick={handleBack} size="large">
                목록으로 돌아가기
              </Button>
            </div>
          </Box>
        </Paper>
      </Container>
    </section>
  );
};

export default ProjectDetailPage;
