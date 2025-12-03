"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { ProjectEditor } from "../components";
import { useProjectStore } from "@/features/project/store/useProjectStore";

import { fetchProject } from "../services/project";

const ProjectDetailPage = () => {
  const params = useParams();
  const projectId = params.id as string;

  const { setProject, setLoading, reset } = useProjectStore();

  useEffect(() => {
    const updateProjects = async () => {
      setLoading(true);
      const response = await fetchProject(projectId);
      if (response) {
        setProject(response);
        setLoading(false);
      }
    };

    if (projectId) {
      updateProjects();
    }

    return () => {
      reset();
    };
  }, [projectId]);

  return <ProjectEditor />;
};

export default ProjectDetailPage;
