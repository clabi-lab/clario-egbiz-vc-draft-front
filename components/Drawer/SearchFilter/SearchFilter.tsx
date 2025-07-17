import { useEffect, useState } from "react";

import { useFilterStore } from "@/store/useFilterStore";

import {
  Collapse,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import posthog from "posthog-js";

// Mock data for filters
const Data = [
  {
    id: 1,
    depth: 1,
    parent: null,
    description: "대분류1",
  },
  {
    id: 2,
    depth: 2,
    parent: 1,
    description: "계측 및 제어기기",
  },
  {
    id: 3,
    depth: 3,
    parent: 1,
    description: "EMA",
  },
  {
    id: 4,
    depth: 3,
    parent: 1,
    description: "EMB",
  },
  {
    id: 5,
    depth: 1,
    parent: null,
    description: "대분류2",
  },
  {
    id: 6,
    depth: 2,
    parent: 5,
    description: "전기기기",
  },
  {
    id: 7,
    depth: 3,
    parent: 5,
    description: "일반요건",
  },
  {
    id: 8,
    depth: 3,
    parent: 5,
    description: "회전기기",
  },
  {
    id: 9,
    depth: 1,
    parent: null,
    description: "대분류",
  },
  {
    id: 10,
    depth: 2,
    parent: 9,
    description: "중분류",
  },
  {
    id: 11,
    depth: 3,
    parent: 9,
    description: "소분류",
  },
  {
    id: 12,
    depth: 3,
    parent: 9,
    description: "소분류",
  },
  {
    id: 13,
    depth: 3,
    parent: 9,
    description: "소분류",
  },
];

const SearchFilter = ({
  filterTitle = "즐겨찾기",
}: {
  filterTitle?: string;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(true); // 즐겨찾기 토글
  const [isFilterVisible, setIsFilterVisible] = useState(true); // 필터 항목만 토글

  const [filters, setfilters] = useState<Filter[]>([]);

  const selectedFilters = useFilterStore((state) => state.selectedFilters);
  const setSelectedFilters = useFilterStore(
    (state) => state.setSelectedFilters
  );

  useEffect(() => {
    setfilters(Data);
  }, []);

  const toggleSelectAll = () => {
    if (selectedFilters.length === filters.length) {
      setSelectedFilters([]);
    } else {
      posthog.capture("filters", {
        keyword: filters.map((f) => f.description).join(", "),
        source: "filters",
      });
      setSelectedFilters(filters);
    }
  };

  const toggleFilter = (
    event: React.ChangeEvent<HTMLInputElement>,
    filter: Filter
  ) => {
    const { checked } = event.target;
    const idx = filters.findIndex((cat) => cat.id === filter.id);
    if (idx === -1) return;

    const clickedFilter = filters[idx];
    let newSelected = [...(selectedFilters || [])];

    if (checked) {
      newSelected.push(filter);

      for (let i = idx + 1; i < filters.length; i++) {
        const cat = filters[i];
        if (cat.depth <= clickedFilter.depth) break;
        newSelected.push(cat);
      }
    } else {
      newSelected = newSelected.filter((item) => item.id !== filter.id);

      for (let i = idx + 1; i < filters.length; i++) {
        const cat = filters[i];
        if (cat.depth <= clickedFilter.depth) break;
        newSelected = newSelected.filter((item) => item.id !== cat.id);
      }
    }

    newSelected = Array.from(new Set(newSelected));

    posthog.capture("filters", {
      keyword: newSelected.map((f) => f.description).join(", "),
      source: "filters",
    });

    setSelectedFilters(newSelected);
  };

  return (
    <List component="div" disablePadding key="histories">
      {/* 검색 */}
      <TextField
        size="small"
        placeholder="검색어 입력"
        sx={{
          ml: 2,
          mr: 2,
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

      {/* filterTitle */}
      <ListItemButton
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        sx={{ height: "30px", mt: 1, ml: 1 }}
      >
        <ListItemText
          slotProps={{
            primary: {
              sx: {
                fontSize: "14px",
                fontWeight: "bold",
              },
            },
          }}
        >
          {filterTitle}
        </ListItemText>
        <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
          <ExpandMoreIcon
            sx={{
              transition: "transform 0.3s ease",
              transform: !isFilterOpen ? "rotate(180deg)" : "none",
            }}
          />
        </ListItemIcon>
      </ListItemButton>
      <Collapse in={isFilterOpen} timeout="auto" unmountOnExit sx={{ ml: 1 }}>
        {/* 전체 선택 */}
        <SelectAllListItemButton key="all">
          <StyledListItemText
            primary={
              <StyledFormControlLabel
                label="전체 선택"
                control={
                  <StyledCheckbox
                    size="small"
                    checked={selectedFilters?.length === filters?.length}
                    onChange={toggleSelectAll}
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
                transform: !isFilterVisible ? "rotate(180deg)" : "none",
              }}
            />
          </ListItemIcon>
        </SelectAllListItemButton>

        {/* 필터 항목들 */}
        <Collapse
          in={isFilterVisible}
          timeout="auto"
          unmountOnExit
          sx={{ ml: 1 }}
        >
          {filters?.map(
            (filter, index) =>
              filter.id && (
                <FilterListItemButton
                  depth={filter.depth}
                  key={`${filter.description}-${index}`}
                >
                  <StyledListItemText
                    primary={
                      <StyledFormControlLabel
                        control={
                          <StyledCheckbox
                            size="small"
                            checked={selectedFilters?.includes(filter)}
                            onChange={(event) => toggleFilter(event, filter)}
                          />
                        }
                        label={filter.description}
                      />
                    }
                  />
                </FilterListItemButton>
              )
          )}
        </Collapse>
      </Collapse>
    </List>
  );
};

export default SearchFilter;
