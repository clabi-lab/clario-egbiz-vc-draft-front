import { create } from "zustand";
import { Filter } from "@/types/Filter";

interface FilterState {
  selectedFilters: Filter[];
  filterTags: string[];
  setSelectedFilters: (filter: Filter[]) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedFilters: [],
  filterTags: [],
  setSelectedFilters: (filters) => {
    // 가장 큰 depth를 동적으로 찾기
    const maxDepth =
      filters.length > 0 ? Math.max(...filters.map((f) => f.depth)) : 0;

    const tags = filters
      .filter((f) => f.depth === maxDepth && f.division)
      .map((f) => f.division);

    set({
      selectedFilters: filters,
      filterTags: tags,
    });
  },
}));
