import { useState } from "react";
import { Button, IconButton } from "@mui/material";
import { CustomTextField } from "@/shared/components/CustomTextField";
import { Chapter } from "@/features/project/types";
import { useProjectStore } from "@/features/project/store/useProjectStore";
import { useDialogStore } from "@/shared/store/useDialogStore";
import { useAlertStore } from "@/shared/store/useAlertStore";

import DragIcon from "@mui/icons-material/DragIndicatorOutlined";
import AutoIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ReplayIcon from "@mui/icons-material/ReplayOutlined";
import CheckIcon from "@mui/icons-material/CheckOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ChapterItemProps {
  chapter: Chapter;
  index: number;
}

export const ChapterItem = ({ chapter, index }: ChapterItemProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const {
    updateChapter,
    deleteChapter,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  } = useProjectStore();
  const { openDialog } = useDialogStore();
  const { openAlert } = useAlertStore();

  const handleDeleteDialog = () => {
    openDialog({
      title: "챕터 삭제",
      message: "챕터를 삭제하시겠습니까? 삭제된 챕터는 복구할 수 없습니다.",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "error",
      onConfirm: () => {
        deleteChapter(index);
        openAlert({
          message: "챕터가 삭제되었습니다.",
          severity: "success",
          openTime: 2000,
        });
      },
    });
  };

  const handleToggleConfirm = () => {
    if (isConfirmed) {
      setIsConfirmed(false);
      openAlert({
        message: "본문 확정이 해제되었습니다.",
        severity: "info",
        openTime: 2000,
      });
    } else {
      if (chapter.draftContent) {
        updateChapter(index, "content", chapter.draftContent);
        setIsConfirmed(true);
        openAlert({
          message: "초안이 본문으로 확정되었습니다.",
          severity: "success",
          openTime: 2000,
        });
      }
    }
  };

  const generateContent = async (prompt: string) => {
    if (!prompt.trim()) {
      openAlert({
        message: "프롬프트를 입력해주세요.",
        severity: "warning",
        openTime: 2000,
      });
      return;
    }

    setIsGenerating(true);
    updateChapter(index, "draftContent", "");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          chapterTitle: chapter.title,
          chapterContent: chapter.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI 생성 실패: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("스트리밍 응답을 받을 수 없습니다.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.content) {
              accumulatedContent += data.content;
              updateChapter(index, "draftContent", accumulatedContent);
            }
            if (data.error) {
              throw new Error(data.error);
            }
          } catch (parseError) {
            console.warn("JSON 파싱 실패:", line);
          }
        }
      }

      openAlert({
        message: "AI 생성이 완료되었습니다.",
        severity: "success",
        openTime: 2000,
      });
    } catch (error) {
      console.error("AI 생성 오류:", error);
      openAlert({
        message:
          error instanceof Error
            ? error.message
            : "AI 생성 중 오류가 발생했습니다.",
        severity: "error",
        openTime: 3000,
      });
    } finally {
      setIsGenerating(false);
      setAiPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      generateContent(aiPrompt);
    }
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={() => handleDragStart(index)}
      onDragEnd={() => {
        handleDragEnd();
        setIsDraggable(false);
        openAlert({
          message: "챕터 순서가 변경되었습니다.",
          severity: "success",
          openTime: 2000,
        });
      }}
      onDragEnter={() => {
        handleDragEnter(index);
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDragOver={(e) => e.preventDefault()}
      className={`bg-white border border-gray-200 rounded-md p-4 flex flex-col gap-4 my-4 transition-all ${
        isDragOver ? "border-blue-500 bg-blue-50" : ""
      }`}
      style={{ cursor: isDraggable ? "grabbing" : "default" }}
    >
      <div className="flex items-center justify-between gap-2">
        <IconButton
          size="small"
          sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
          onMouseDown={() => setIsDraggable(true)}
          onMouseUp={() => setIsDraggable(false)}
        >
          <DragIcon sx={{ width: 16, height: 16 }} aria-hidden="true" />
        </IconButton>

        <div
          className="w-full"
          onMouseDown={() => setIsDraggable(false)}
          onMouseUp={() => setIsDraggable(false)}
        >
          <CustomTextField
            className="w-full"
            size="small"
            variant="filled"
            hiddenLabel
            value={chapter.title || ""}
            onChange={(e) => updateChapter(index, "title", e.target.value)}
            fullWidth
            disabled={isConfirmed}
          />
        </div>

        <IconButton
          size="small"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex-shrink-0"
        >
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </div>

      {!isCollapsed && (
        <>
          <fieldset onMouseDown={() => setIsDraggable(false)}>
            <legend className="text-sm text-gray-500">확정된 본문</legend>
            <CustomTextField
              className="w-full"
              size="small"
              variant="filled"
              hiddenLabel
              value={chapter.content || ""}
              onChange={(e) => updateChapter(index, "content", e.target.value)}
              fullWidth
              disabled={isConfirmed}
            />
          </fieldset>

          <fieldset onMouseDown={() => setIsDraggable(false)}>
            <legend className="text-sm text-gray-500">생성 초안</legend>
            <CustomTextField
              className="w-full"
              size="small"
              variant="filled"
              rows={3}
              hiddenLabel
              multiline
              placeholder="본문 내용을 직접 입력하거나, 하단의 AI 생성 프롬포트를 사용하여 AI가 생성하도록 할 수 있습니다."
              value={chapter.draftContent || ""}
              onChange={(e) =>
                updateChapter(index, "draftContent", e.target.value)
              }
              fullWidth
              disabled={isGenerating || isConfirmed}
            />
          </fieldset>

          <fieldset onMouseDown={() => setIsDraggable(false)}>
            <legend className="text-sm text-gray-500">AI 생성 프롬프트</legend>
            <CustomTextField
              className="w-full"
              size="small"
              variant="filled"
              rows={3}
              multiline
              hiddenLabel
              placeholder="AI가 생성할 내용에 대한 구체적인 지시사항을 입력하세요. 예: '고객 성공 사례 3가지를 포함하여 작성'"
              fullWidth
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating || isConfirmed}
            />
          </fieldset>

          <div
            className="flex items-center justify-between gap-2"
            onMouseDown={() => setIsDraggable(false)}
          >
            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AutoIcon />}
                size="small"
                onClick={() => generateContent(aiPrompt)}
                disabled={isGenerating || !aiPrompt.trim() || isConfirmed}
              >
                {isGenerating ? "생성 중..." : "기본 생성"}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<ReplayIcon />}
                size="small"
                onClick={() => generateContent(aiPrompt)}
                disabled={isGenerating || !aiPrompt.trim() || isConfirmed}
              >
                재생성
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<CheckIcon />}
                size="small"
                onClick={handleToggleConfirm}
                disabled={!chapter.draftContent || isGenerating}
              >
                {isConfirmed ? "확정 해제" : "확정"}
              </Button>
            </div>

            <Button
              color="error"
              startIcon={<SaveIcon />}
              size="small"
              onClick={handleDeleteDialog}
              disabled={isGenerating}
            >
              삭제
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
