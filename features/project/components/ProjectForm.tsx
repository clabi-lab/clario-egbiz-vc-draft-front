"use client";

import { Button } from "@mui/material";
import { CustomTextField } from "@/shared/components/CustomTextField";
import { ChapterItem } from "./ChapterItem";
import { Project } from "../types";

import SaveIcon from "@mui/icons-material/SaveOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";

interface ProjectFormProps {
  project: Project | null;
  onUpdateTitle: (title: string) => void;
  onAddChapter: () => void;
}

export const ProjectForm = ({
  project,
  onUpdateTitle,
  onAddChapter,
}: ProjectFormProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      onAddChapter();
    }
  };

  return (
    <form>
      <fieldset>
        <legend className="text-sm text-gray-500">문서 제목</legend>
        <div className="flex items-center justify-between gap-2">
          <CustomTextField
            className="w-full"
            size="small"
            variant="filled"
            hiddenLabel
            value={project?.title || ""}
            onChange={(e) => onUpdateTitle(e.target.value)}
            fullWidth
            inputProps={{
              "aria-label": "문서 제목",
            }}
          />
          <Button
            className="flex-shrink-0"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<SaveIcon aria-hidden="true" />}
            aria-label="문서 제목 저장"
          >
            저장
          </Button>
        </div>
      </fieldset>

      <div className="flex items-center justify-between gap-2 mt-6">
        <p>챕터 목록</p>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon aria-hidden="true" />}
          size="small"
          onClick={onAddChapter}
          onKeyDown={handleKeyDown}
          aria-label="새 챕터 추가"
        >
          챕터 추가
        </Button>
      </div>
      {project?.chapters?.map((chapter, index) => (
        <ChapterItem
          key={`${chapter.title}-${index}`}
          chapter={chapter}
          index={index}
        />
      ))}
    </form>
  );
};
