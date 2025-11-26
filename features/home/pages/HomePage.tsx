"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Container, TextField } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FileIcon from "@mui/icons-material/DescriptionOutlined";
import ProjectCard from "../components/ProjectCard";
import CreateProjectDialog from "../components/CreateProjectDialog";
import SearchIcon from "@mui/icons-material/Search";
import { useDialogStore } from "@/shared/store/useDialogStore";

import { fetchProjects } from "../services/home";

interface Project {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const HomePage = () => {
  const router = useRouter();
  const { openCustomDialog } = useDialogStore();

  const [totalCount, setTotalCount] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleOpenDialog = () => {
    openCustomDialog(CreateProjectDialog, {
      onCreateProject: () => {
        router.push("/project");
      },
    });
  };

  const fetchProjectsData = async () => {
    const response = await fetchProjects();
    setProjects(response.data);
    setTotalCount(response.data.length || 0);
  };

  useEffect(() => {
    fetchProjectsData();
  }, []);

  return (
    <section>
      <nav className="p-4 font-bold text-xl">소개 자료 관리</nav>
      <section className="border-b border-t border-gray-200 py-4">
        <Container maxWidth="lg" className="flex items-center gap-4">
          <div className="flex-1">
            <TextField
              className="w-full"
              variant="filled"
              size="small"
              placeholder="소개 자료 검색"
              hiddenLabel
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchIcon
                      sx={{
                        width: 20,
                        height: 20,
                        mr: 1,
                        color: "text.secondary",
                      }}
                    />
                  ),
                },
              }}
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "oklch(96.7% 0.003 264.542)",
                  border: "none",
                  "&:before": {
                    borderBottom: "none",
                  },
                  "&:after": {
                    borderBottom: "none",
                  },
                },
              }}
            />
          </div>
          <p className="text-sm text-gray-500">총 {totalCount}개의 프로젝트</p>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            새 초안 만들기
          </Button>
        </Container>
      </section>

      <Container
        maxWidth="lg"
        className="pt-6 bg-slate-50 h-[calc(100svh-134px)]"
      >
        {projects.length > 0 ? (
          <div className="flex gap-6 w-full">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                refetchProjects={fetchProjectsData}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-[150px]">
            <FileIcon className="text-gray-400" sx={{ fontSize: 40 }} />
            <p className="mt-2">아직 생성된 프로젝트가 없습니다. </p>
            <p className="text-gray-400 mb-4">새 초안을 만들어보세요. </p>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              새 초안 만들기
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default HomePage;
