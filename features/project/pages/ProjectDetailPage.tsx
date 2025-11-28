"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { ProjectEditor } from "../components";
import { Project } from "@/features/project/types";
import { useProjectStore } from "@/features/project/store/useProjectStore";

import { fetchProjects } from "../services/project";

const ProjectDetailPage = () => {
  const params = useParams();
  const projectId = params.id as string;

  const { setProject, setLoading, reset } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      updateProjects();
    }

    return () => {
      reset();
    };
  }, [projectId]);

  const updateProjects = async () => {
    setLoading(true);
    const response = (await fetchProjects(projectId)) as unknown as Project;
    if (response) {
      setProject(response);
      setLoading(false);
    }
  };

  return <ProjectEditor />;
};

export default ProjectDetailPage;
