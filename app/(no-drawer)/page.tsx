"use client";

import { useEffect, useState } from "react";

import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FileIcon from "@mui/icons-material/DescriptionOutlined";

const HomePage = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [sortType, setSortType] = useState<"newest" | "title">("newest");

  const handleChange = (event: SelectChangeEvent) => {
    setSortType(event.target.value as "newest" | "title");
  };

  useEffect(() => {
    setTotalCount(0);
  }, []);

  return (
    <section>
      <nav className="p-4 font-bold text-xl">소개 자료 관리</nav>
      <section className="flex gap-4 items-center justify-center border-b border-t border-gray-200 py-4">
        <div className="w-1/2">
          <TextField
            className="w-full"
            variant="outlined"
            size="small"
            hiddenLabel
            sx={{
              "& .MuiFilledInput-root": {
                border: "none",
                "&:before": {
                  borderBottom: "none",
                },
                "&:after": {
                  borderBottom: "none",
                },
              },
            }}
          />
        </div>
        <p>총 {totalCount}개의 프로젝트</p>
        <Select
          className="flex-shrink-0"
          variant="outlined"
          id="sort-type-select"
          value={sortType}
          onChange={handleChange}
          size="small"
        >
          <MenuItem value={"newest"}>최신순</MenuItem>
          <MenuItem value={"title"}>제목순</MenuItem>
        </Select>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          새 초안 만들기
        </Button>
      </section>
      <section className="mt-[200px] flex flex-col items-center justify-center gap-1 text-lg">
        <FileIcon className="text-gray-400" sx={{ fontSize: 40 }} />
        <p className="mt-2">아직 생성된 프로젝트가 없습니다. </p>
        <p className="text-gray-400 mb-4">새 초안을 만들어보세요. </p>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          새 초안 만들기
        </Button>
      </section>
    </section>
  );
};

export default HomePage;
