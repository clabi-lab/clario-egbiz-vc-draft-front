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
    const tags = filters
      .filter((f) => f.depth === 3 && f.division)
      .map((f) => f.division);

    set({
      selectedFilters: filters,
      filterTags: tags,
    });
  },
}));
