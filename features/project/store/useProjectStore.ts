import { create } from "zustand";
import { Chapter, Company, Project } from "../types";

export type { Chapter, Company, Project };

interface ProjectState {
  project: Project | null;
  loading: boolean;
  draggedIndex: number | null;

  setProject: (project: Project | null) => void;
  setLoading: (loading: boolean) => void;
  updateProject: (updates: Partial<Project>) => void;
  updateProjectTitle: (title: string) => void;
  addChapter: (chapter?: Chapter) => void;
  updateChapter: (index: number, field: keyof Chapter, value: string) => void;
  deleteChapter: (index: number) => void;
  reorderChapters: (fromIndex: number, toIndex: number) => void;
  setDraggedIndex: (index: number | null) => void;
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
  reset: () => void;
}

const DEFAULT_CHAPTER: Chapter = {
  title: "새 챕터",
  content: "",
  draftContent: "",
};

const INITIAL_STATE = {
  project: null,
  loading: false,
  draggedIndex: null,
};

export const useProjectStore = create<ProjectState>((set, get) => ({
  ...INITIAL_STATE,

  setProject: (project) => set({ project }),

  setLoading: (loading) => set({ loading }),

  updateProject: (updates) =>
    set((state) => {
      if (!state.project) return state;
      return { project: { ...state.project, ...updates } };
    }),

  updateProjectTitle: (title) =>
    set((state) => {
      if (!state.project) return state;
      return { project: { ...state.project, title } };
    }),

  addChapter: (chapter = DEFAULT_CHAPTER) =>
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          chapters: [...(state.project.chapters || []), chapter],
        },
      };
    }),

  updateChapter: (index, field, value) =>
    set((state) => {
      if (!state.project?.chapters) return state;
      return {
        project: {
          ...state.project,
          chapters: state.project.chapters.map((chapter, i) =>
            i === index ? { ...chapter, [field]: value } : chapter
          ),
        },
      };
    }),

  deleteChapter: (index) =>
    set((state) => {
      if (!state.project?.chapters) return state;
      return {
        project: {
          ...state.project,
          chapters: state.project.chapters.filter((_, i) => i !== index),
        },
      };
    }),

  reorderChapters: (fromIndex, toIndex) =>
    set((state) => {
      if (!state.project?.chapters) return state;
      const chapters = [...state.project.chapters];
      const [movedChapter] = chapters.splice(fromIndex, 1);
      chapters.splice(toIndex, 0, movedChapter);
      return { project: { ...state.project, chapters } };
    }),

  setDraggedIndex: (index) => set({ draggedIndex: index }),

  handleDragStart: (index) => set({ draggedIndex: index }),

  handleDragEnter: (index) => {
    const { draggedIndex, reorderChapters } = get();
    if (draggedIndex === null || draggedIndex === index) return;
    reorderChapters(draggedIndex, index);
    set({ draggedIndex: index });
  },

  handleDragEnd: () => set({ draggedIndex: null }),

  reset: () => set(INITIAL_STATE),
}));
