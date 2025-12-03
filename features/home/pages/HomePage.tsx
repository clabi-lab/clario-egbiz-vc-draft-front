"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button, CircularProgress, Container } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FileIcon from "@mui/icons-material/DescriptionOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ProjectCard from "../components/ProjectCard";
import CreateProjectDialog from "../components/CreateProjectDialog";
import { CustomTextField } from "@/shared/components/CustomTextField";
import { useDialogStore } from "@/shared/store/useDialogStore";

import { fetchProjects } from "../services/home";
import { Project } from "../types";

const HomePage = () => {
  const router = useRouter();
  const { openCustomDialog } = useDialogStore();

  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const handleOpenDialog = () => {
    openCustomDialog(CreateProjectDialog, {
      onCreateProject: () => {
        router.push("/project");
      },
    });
  };

  const fetchProjectsData = async (search?: string) => {
    try {
      setLoading(true);
      const response = await fetchProjects(search);

      console.log(response);
      setProjects(response.data);
      setTotalCount(response.totalCount || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchProjectsData(searchQuery);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, []);

  return (
    <main>
      <header>
        <h1 className="p-4 font-bold text-xl">초안 관리</h1>
      </header>
      <section
        className="border-b border-t border-gray-200 py-4"
        aria-label="초안 검색 및 생성"
      >
        <Container
          maxWidth="lg"
          className="flex items-center gap-4 sm:flex-row flex-col"
        >
          <div className="flex-1 w-full">
            <CustomTextField
              className="w-full"
              variant="filled"
              size="small"
              placeholder="제목으로 검색"
              hiddenLabel
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              slotProps={{
                input: {
                  "aria-label": "초안 검색 - 초안 제목으로 검색할 수 있습니다",
                  role: "searchbox",
                  "aria-controls": "project-list-region",
                  startAdornment: (
                    <SearchIcon
                      sx={{
                        width: 20,
                        height: 20,
                        mr: 1,
                        color: "text.secondary",
                      }}
                      aria-hidden="true"
                    />
                  ),
                },
              }}
            />
          </div>
          <p
            className="text-sm text-gray-500"
            aria-live="polite"
            aria-atomic="true"
          >
            {`총 ${totalCount}개의 초안`}
          </p>
          <Button
            className="w-full sm:w-auto"
            variant="contained"
            color="primary"
            startIcon={<AddIcon aria-hidden="true" />}
            onClick={handleOpenDialog}
            aria-label="새 초안 만들기"
          >
            새 초안 만들기
          </Button>
        </Container>
      </section>

      <section
        className="bg-slate-50 h-[calc(100svh-134px)]"
        aria-label="초안 목록"
        id="project-list-region"
      >
        <Container maxWidth="lg" className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center mt-[150px]">
              <CircularProgress />
            </div>
          ) : projects.length > 0 ? (
            <div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
              role="list"
              aria-label="초안 카드 목록"
            >
              {projects.map((project) => (
                <div key={project.project_id} role="listitem">
                  <ProjectCard
                    className="w-full min-h-[170px]"
                    project={project}
                    refetchProjects={() => fetchProjectsData(searchQuery)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center mt-[150px]"
              role="status"
              aria-live="polite"
            >
              <FileIcon
                className="text-gray-400"
                sx={{ fontSize: 40 }}
                aria-hidden="true"
              />
              <h2 className="mt-2 text-lg font-medium">
                {(searchQuery &&
                  projects.length === 0 &&
                  "검색 결과가 없습니다.") ||
                  (!searchQuery &&
                    projects.length === 0 &&
                    "아직 생성된 초안이 없습니다.")}
              </h2>
              <p className="text-gray-400 mb-4">새 초안을 만들어보세요.</p>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon aria-hidden="true" />}
                onClick={handleOpenDialog}
                aria-label="새 초안 만들기 - 첫 번째 초안을 생성하여 시작하세요"
              >
                새 초안 만들기
              </Button>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
};

export default HomePage;
