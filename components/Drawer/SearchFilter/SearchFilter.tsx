import { useEffect, useState, useCallback, useMemo } from "react";
import posthog from "posthog-js";

import { useFilterStore } from "@/store/useFilterStore";

import {
  Collapse,
  InputAdornment,
  List,
  ListItemIcon,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { fetchFilters } from "@/services/homeService";

import {
  SelectAllListItemButton,
  FilterListItemButton,
  StyledCheckbox,
  StyledFormControlLabel,
  StyledListItemText,
} from "./styles";

import { Filter } from "@/types/Filter";

const SearchFilter = () => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});

  const selectedFilters = useFilterStore((state) => state.selectedFilters);
  const setSelectedFilters = useFilterStore(
    (state) => state.setSelectedFilters
  );

  useEffect(() => {
    updateFilters("");
  }, []);

  const updateFilters = async (text: string) => {
    try {
      const filters = await fetchFilters({ search: text });
      setFilters(filters);
    } catch (error) {
      console.error("Failed to fetch filters", error);
    }
  };

  const childMap = useMemo(() => {
    const map = new Map<number, Filter[]>();
    filters.forEach((filter) => {
      if (filter.parent_id == null) return;
      if (!map.has(filter.parent_id)) map.set(filter.parent_id, []);
      map.get(filter.parent_id)!.push(filter);
    });
    return map;
  }, [filters]);

  const getChildFilters = useCallback(
    (parentId: number) => childMap.get(parentId) ?? [],
    [childMap]
  );

  const getDescendants = useCallback(
    (parent: Filter): Filter[] => {
      const descendants: Filter[] = [];
      const queue: Filter[] = [parent];
      while (queue.length > 0) {
        const current = queue.shift()!;
        const children = getChildFilters(current.id);
        descendants.push(...children);
        queue.push(...children);
      }
      return descendants;
    },
    [getChildFilters]
  );

  const getAncestors = useCallback(
    (child: Filter): Filter[] => {
      const ancestors: Filter[] = [];
      let current = child;
      while (current.parent_id !== null) {
        const parent = filters.find((f) => f.id === current.parent_id);
        if (!parent) break;
        ancestors.push(parent);
        current = parent;
      }
      return ancestors;
    },
    [filters]
  );

  const isFilterSelected = useCallback(
    (filter: Filter) => selectedFilters.some((f) => f.id === filter.id),
    [selectedFilters]
  );

  const isAllSelected = useMemo(() => {
    const rootFilters = filters.filter((f) => f.depth === 1);
    return (
      rootFilters.length > 0 &&
      rootFilters.every((filter) =>
        selectedFilters.some((sf) => sf.id === filter.id)
      )
    );
  }, [filters, selectedFilters]);

  const toggleExpand = (id: number) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedFilters([]);
    } else {
      const allKeywords = filters.map((f) => f.division).join(", ");
      posthog.capture("filters", {
        keyword: allKeywords,
        source: "filters",
      });
      setSelectedFilters(filters);
    }
  };

  const handleFilterToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    filter: Filter
  ) => {
    const { checked } = event.target;
    const idx = filters.findIndex((f) => f.id === filter.id);
    if (idx === -1) return;

    let newSelected = [...selectedFilters];

    if (checked) {
      newSelected.push(filter);
      newSelected.push(...getDescendants(filter));
      getAncestors(filter).forEach((ancestor) => {
        const allChildrenSelected = getChildFilters(ancestor.id).every(
          (child) => newSelected.some((f) => f.id === child.id)
        );
        if (allChildrenSelected) newSelected.push(ancestor);
      });
    } else {
      const descendantIds = new Set(getDescendants(filter).map((f) => f.id));
      newSelected = newSelected.filter(
        (f) => f.id !== filter.id && !descendantIds.has(f.id)
      );
      getAncestors(filter).forEach((ancestor) => {
        newSelected = newSelected.filter((f) => f.id !== ancestor.id);
      });
    }

    const uniqueSelected = Array.from(
      new Map(newSelected.map((f) => [f.id, f])).values()
    );

    posthog.capture("filters", {
      keyword: uniqueSelected.map((f) => f.division).join(", "),
      source: "filters",
    });

    setSelectedFilters(uniqueSelected);
  };

  const handleSearchFilter = async (text: string) => {
    await updateFilters(text);
    setIsFilterVisible(true);
  };

  const renderFilterTree = (filter: Filter) => {
    const children = getChildFilters(filter.id);
    const isExpanded = expandedMap[filter.id];

    return (
      <div key={filter.id}>
        <FilterListItemButton depth={filter.depth}>
          <StyledListItemText
            primary={
              <StyledFormControlLabel
                control={
                  <StyledCheckbox
                    size="small"
                    checked={isFilterSelected(filter)}
                    onChange={(e) => handleFilterToggle(e, filter)}
                  />
                }
                label={filter.division}
              />
            }
          />
          {children.length > 0 && (
            <ListItemIcon
              sx={{ color: "inherit", minWidth: 32 }}
              onClick={() => toggleExpand(filter.id)}
            >
              <ExpandMoreIcon
                sx={{
                  transition: "transform 0.3s ease",
                  transform: isExpanded ? "rotate(-180deg)" : "none",
                }}
              />
            </ListItemIcon>
          )}
        </FilterListItemButton>

        {children.length > 0 && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit sx={{ ml: 1 }}>
            {children.map(renderFilterTree)}
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <List component="div" disablePadding>
      <TextField
        size="small"
        placeholder="검색어 입력"
        sx={{ ml: 2, mr: 2 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            handleSearchFilter((e.target as HTMLInputElement).value);
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      <SelectAllListItemButton>
        <StyledListItemText
          primary={
            <StyledFormControlLabel
              label="전체"
              control={
                <StyledCheckbox
                  size="small"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              }
            />
          }
        />
        <ListItemIcon
          sx={{ color: "inherit", minWidth: 32 }}
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        >
          <ExpandMoreIcon
            sx={{
              transition: "transform 0.3s ease",
              transform: !isFilterVisible ? "none" : "rotate(-180deg)",
            }}
          />
        </ListItemIcon>
      </SelectAllListItemButton>

      <Collapse
        in={isFilterVisible}
        timeout="auto"
        unmountOnExit
        sx={{ ml: 1 }}
      >
        {filters.filter((f) => f.depth === 1).map(renderFilterTree)}
      </Collapse>
    </List>
  );
};

export default SearchFilter;
