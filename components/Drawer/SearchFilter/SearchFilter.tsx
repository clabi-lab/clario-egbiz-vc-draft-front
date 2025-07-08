import { useEffect, useState } from "react";

import {
  Collapse,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";

import {
  SelectAllListItemButton,
  FilterListItemButton,
  StyledCheckbox,
  StyledFormControlLabel,
  StyledListItemText,
} from "./styles";

import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
];

export interface Filter {
  id: number;
  depth: number;
  parent: number | null;
  description: string;
}

const SearchFilter = () => {
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true); // 즐겨찾기 토글
  const [isFilterVisible, setIsFilterVisible] = useState(true); // 필터 항목만 토글

  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
  const [filters, setfilters] = useState<Filter[]>([]);

  useEffect(() => {
    setfilters(Data);
  }, []);

  const toggleSelectAll = () => {
    if (selectedFilters.length === filters.length) {
      setSelectedFilters([]);
    } else {
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

      {/* 즐겨찾기 */}
      <ListItemButton
        onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
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
          즐겨찾기
        </ListItemText>
        <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
          <ExpandMoreIcon
            sx={{
              transition: "transform 0.3s ease",
              transform: !isFavoritesOpen ? "rotate(180deg)" : "none",
            }}
          />
        </ListItemIcon>
      </ListItemButton>
      <Collapse
        in={isFavoritesOpen}
        timeout="auto"
        unmountOnExit
        sx={{ ml: 1 }}
      >
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
