import { ProjectInfo } from "@/types/Common";
import { create } from "zustand";

interface ProjectState {
  projectInfo: ProjectInfo | null;
  setProjectInfo: (projectInfo: ProjectInfo) => void;
  ip: string;
  setIp: (ip: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectInfo: null,
  setProjectInfo: (projectInfo) => set({ projectInfo }),
  ip: "",
  setIp: (ip) => set({ ip }),
}));
