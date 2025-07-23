import { useEffect, useState, useCallback } from "react";
import posthog from "posthog-js";

import { useFilterStore } from "@/store/useFilterStore";
import { useFetchFilters } from "@/hooks/useHomeData";

import {
  Collapse,
  InputAdornment,
  List,
  ListItemIcon,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  SelectAllListItemButton,
  FilterListItemButton,
  StyledCheckbox,
  StyledFormControlLabel,
  StyledListItemText,
} from "./styles";

import { Filter } from "@/types/Filter";

const SearchFilter = () => {
  const { data: filters = [], mutateAsync: updateFilters } = useFetchFilters();

  const selectedFilters = useFilterStore((state) => state.selectedFilters);
  const setSelectedFilters = useFilterStore(
    (state) => state.setSelectedFilters
  );

  const [searchText, setSearchText] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    updateFilters({});
  }, [updateFilters]);

  const isFilterSelected = useCallback(
    (filter: Filter) => selectedFilters.some((f) => f.id === filter.id),
    [selectedFilters]
  );

  const getChildFilters = useCallback(
    (parentId: number) => filters.filter((f) => f.parent_id === parentId),
    [filters]
  );

  const toggleExpand = (id: number) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = () => {
    if (selectedFilters.length === filters.length) {
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
      for (let i = idx + 1; i < filters.length; i++) {
        const child = filters[i];
        if (child.depth <= filter.depth) break;
        newSelected.push(child);
      }
    } else {
      newSelected = newSelected.filter((f) => f.id !== filter.id);
      for (let i = idx + 1; i < filters.length; i++) {
        const child = filters[i];
        if (child.depth <= filter.depth) break;
        newSelected = newSelected.filter((f) => f.id !== child.id);
      }
    }

    newSelected = Array.from(new Set(newSelected));
    posthog.capture("filters", {
      keyword: newSelected.map((f) => f.division).join(", "),
      source: "filters",
    });

    setSelectedFilters(newSelected);
  };

  const handleSearchFilter = async () => {
    try {
      await updateFilters({ search: searchText });
    } catch (error) {
      console.error(error);
    }
  };

  const renderFilterTree = (filter: Filter) => {
    const children = getChildFilters(filter.id);
    const hasChildren = children.length > 0;
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
          {hasChildren && (
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

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit sx={{ ml: 1 }}>
            {children.map((child) => renderFilterTree(child))}
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
          if (e.key === "Enter") handleSearchFilter();
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
                  checked={selectedFilters.length === filters.length}
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
              transform: !isFilterVisible ? "none" : "rotate(180deg)",
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
