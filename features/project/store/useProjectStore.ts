import { create } from "zustand";
import { Chapter, Company, ProjectDetail } from "../types";

export type { Chapter, Company, ProjectDetail };

interface ProjectState {
  project: ProjectDetail | null;
  loading: boolean;
  draggedIndex: number | null;

  setProject: (project: ProjectDetail | null) => void;
  setLoading: (loading: boolean) => void;
  updateProject: (updates: Partial<ProjectDetail>) => void;
  updateProjectTitle: (title: string) => void;
  addChapter: (chapter?: Chapter) => void;
  removeChapter: (chapter_id: number) => void;
  updateChapterField: (
    index: number,
    field: keyof Chapter,
    value: string
  ) => void;
  reorderChapters: (fromIndex: number, toIndex: number) => void;
  setDraggedIndex: (index: number | null) => void;
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
  reset: () => void;
}

const DEFAULT_CHAPTER: Chapter = {
  ai_create_count: 0,
  chapter_body: "",
  chapter_id: 0,
  chapter_name: "새 챕터",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
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
      return { project: { ...state.project, project_name: title } };
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

  removeChapter: (chapter_id: number) =>
    set((state) => {
      if (!state.project?.chapters) return state;
      return {
        project: {
          ...state.project,
          chapters: state.project.chapters.filter(
            (chapter) => chapter.chapter_id !== chapter_id
          ),
        },
      };
    }),

  updateChapterField: (index, field, value) =>
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
