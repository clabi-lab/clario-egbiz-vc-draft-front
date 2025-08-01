"use client";

import { useEffect } from "react";

import { useProjectStore } from "@/store/useProjectStore";

import { ProjectInfo } from "@/types/Common";

const AppInitializer = ({ projectinfo }: { projectinfo: ProjectInfo }) => {
  const setProjectInfo = useProjectStore((state) => state.setProjectInfo);

  useEffect(() => {
    setProjectInfo(projectinfo);
  }, [projectinfo]);

  return null;
};

export default AppInitializer;
