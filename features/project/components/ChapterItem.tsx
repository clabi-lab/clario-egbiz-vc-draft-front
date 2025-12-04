import { useState, useEffect, useCallback, useRef } from "react";

import { Button, IconButton } from "@mui/material";
import { CustomTextField } from "@/shared/components/CustomTextField";
import { Chapter } from "@/features/project/types";
import { useProjectStore } from "@/features/project/store/useProjectStore";
import { useDialogStore } from "@/shared/store/useDialogStore";
import { useAlertStore } from "@/shared/store/useAlertStore";
import { useUserStore } from "@/shared/store/useUserStore";

import DragIcon from "@mui/icons-material/DragIndicatorOutlined";
import AutoIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ReplayIcon from "@mui/icons-material/ReplayOutlined";
import CheckIcon from "@mui/icons-material/CheckOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  updateChapter,
  deleteChapter,
  createChapter,
  createProject,
} from "../services/project";

interface ChapterItemProps {
  chapter: Chapter;
  index: number;
}

export const ChapterItem = ({ chapter, index }: ChapterItemProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(() => {
    return !!chapter.chapter_body;
  });
  const [aiPrompt, setAiPrompt] = useState("");

  // 로컬 상태로 입력값 관리 (성능 최적화)
  const [localChapterName, setLocalChapterName] = useState(
    chapter.chapter_name || ""
  );
  const [localChapterBody, setLocalChapterBody] = useState(
    chapter.chapter_body || ""
  );
  const [localDraftContent, setLocalDraftContent] = useState(
    chapter.draftContent || ""
  );

  // debounce를 위한 타이머 ref
  const debounceTimerRef = useRef<Record<string, NodeJS.Timeout>>({});

  const {
    project,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    updateChapterField,
    removeChapter,
  } = useProjectStore();
  const { user } = useUserStore();

  const { openDialog } = useDialogStore();
  const { openAlert } = useAlertStore();

  useEffect(() => {
    setLocalChapterName(chapter.chapter_name || "");
    setLocalChapterBody(chapter.chapter_body || "");
    setLocalDraftContent(chapter.draftContent || "");
  }, [chapter.chapter_name, chapter.chapter_body, chapter.draftContent]);

  const debouncedUpdate = useCallback(
    (field: keyof Chapter, value: string) => {
      if (debounceTimerRef.current[field]) {
        clearTimeout(debounceTimerRef.current[field]);
      }

      debounceTimerRef.current[field] = setTimeout(() => {
        updateChapterField(index, field, value);
      }, 300);
    },
    [index, updateChapterField]
  );

  useEffect(() => {
    return () => {
      Object.values(debounceTimerRef.current).forEach((timer) =>
        clearTimeout(timer)
      );
    };
  }, []);

  const handleDeleteDialog = (chapter_id: number) => {
    openDialog({
      title: "챕터 삭제",
      message: "챕터를 삭제하시겠습니까? 삭제된 챕터는 복구할 수 없습니다.",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "error",
      onConfirm: () => handleDeleteChapter(chapter_id),
    });
  };

  const handleDeleteChapter = async (chapter_id: number) => {
    try {
      if (chapter_id !== 0) {
        await deleteChapter(chapter_id);
      }
      removeChapter(chapter_id);
      openAlert({
        message: "챕터가 삭제되었습니다.",
        severity: "success",
        openTime: 2000,
      });
    } catch (error) {
      console.error("챕터 삭제 오류:", error);
      openAlert({
        message: "챕터 삭제 중 오류가 발생했습니다.",
        severity: "error",
        openTime: 3000,
      });
    }
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
      // 확정 전에 로컬 상태를 store에 동기화
      const updatedChapter = {
        ...chapter,
        chapter_name: localChapterName,
        chapter_body: localChapterBody,
        draftContent: localDraftContent,
      };

      if (chapter.chapter_id) {
        handleUpdateChapter(updatedChapter);
      } else if (project) {
        handleCreateChapter(updatedChapter);
      }
    }
  };

  const handleUpdateChapter = async (chapter: Chapter) => {
    try {
      await updateChapter(chapter.chapter_id, chapter);

      setIsConfirmed(true);
      openAlert({
        message: "초안이 본문으로 확정되었습니다.",
        severity: "success",
        openTime: 2000,
      });
    } catch (error) {
      console.error("챕터 확정 오류:", error);
      openAlert({
        message: "챕터 확정 중 오류가 발생했습니다.",
        severity: "error",
        openTime: 3000,
      });
    }
  };

  const handleCreateChapter = async (chapter: Chapter) => {
    try {
      if (project?.project_id) {
        await createChapter(project.project_id, chapter);
      } else {
        const response = await createProject({
          user_id: user?.user_id || 0,
          biz_name: user?.company?.company_name || "",
          pdf_yn: false,
          project_name: project?.project_name,
          chapters: project?.chapters || [],
        });

        if (response.project_id) {
          await createChapter(response.project_id, chapter);
        }
      }

      setIsConfirmed(true);
      openAlert({
        message: "챕터가 생성되었습니다.",
        severity: "success",
        openTime: 2000,
      });
    } catch (error) {
      console.error("챕터 생성 오류:", error);
      openAlert({
        message: "챕터 생성 중 오류가 발생했습니다.",
        severity: "error",
        openTime: 3000,
      });
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
    setLocalDraftContent("");
    updateChapterField(index, "draftContent", "");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          chapterTitle: chapter.chapter_name,
          chapterContent: chapter.chapter_body,
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
              setLocalDraftContent(accumulatedContent);
              updateChapterField(index, "draftContent", accumulatedContent);
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

  const handleDragEndEvent = () => {
    handleDragEnd();
    setIsDraggable(false);
    openAlert({
      message: "챕터 순서가 변경되었습니다.",
      severity: "success",
      openTime: 2000,
    });
  };

  const handleDragEnterEvent = () => {
    handleDragEnter(index);
    setIsDragOver(true);
  };

  const getChapterClassName = () => {
    const baseClasses =
      "rounded-md p-4 flex flex-col gap-4 my-4 transition-all";
    const bgClass = isConfirmed ? "bg-[#fafefc]" : "bg-white";
    const borderClass = isConfirmed
      ? "border border-[#b9f8cf]"
      : "border border-gray-200";
    const dragClass = isDragOver ? "border-blue-500 bg-blue-50" : "";

    return `${baseClasses} ${bgClass} ${borderClass} ${dragClass}`;
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={() => handleDragStart(index)}
      onDragEnd={() => handleDragEndEvent()}
      onDragEnter={() => handleDragEnterEvent()}
      onDragLeave={() => setIsDragOver(false)}
      onDragOver={(e) => e.preventDefault()}
      className={getChapterClassName()}
      style={{ cursor: isDraggable ? "grabbing" : "default" }}
    >
      <div className="flex items-center justify-between gap-2">
        <IconButton
          size="small"
          sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
          onMouseDown={() => setIsDraggable(true)}
          onMouseUp={() => setIsDraggable(false)}
          aria-label="챕터 순서 변경"
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
            value={localChapterName}
            onChange={(e) => {
              setLocalChapterName(e.target.value);
              debouncedUpdate("chapter_name", e.target.value);
            }}
            fullWidth
            disabled={isConfirmed}
            slotProps={{
              input: {
                "aria-label": "챕터 제목",
              },
            }}
          />
        </div>

        <IconButton
          size="small"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex-shrink-0"
          aria-label={isCollapsed ? "챕터 펼치기" : "챕터 접기"}
        >
          {isCollapsed ? (
            <ExpandMoreIcon aria-hidden="true" />
          ) : (
            <ExpandLessIcon aria-hidden="true" />
          )}
        </IconButton>
      </div>

      {!isCollapsed && (
        <>
          <fieldset onMouseDown={() => setIsDraggable(false)}>
            <legend className="text-sm mb-1">확정된 본문</legend>
            <CustomTextField
              className="w-full"
              size="small"
              variant="filled"
              bgColor="#fafefc"
              borderColor="#b9f8cf"
              rows={3}
              placeholder="확정할 최종 본문 내용을 입력하세요."
              multiline
              hiddenLabel
              fullWidth
              value={localChapterBody}
              onChange={(e) => {
                setLocalChapterBody(e.target.value);
                debouncedUpdate("chapter_body", e.target.value);
              }}
              disabled={isConfirmed}
              slotProps={{
                input: {
                  "aria-label": "확정된 본문",
                },
              }}
            />
            <span className="text-xs text-gray-400">
              확정 버튼을 누르면 이 내용이 최종본으로 저장됩니다.
            </span>
          </fieldset>

          <fieldset onMouseDown={() => setIsDraggable(false)}>
            <legend className="text-sm mb-1">생성 초안</legend>
            <CustomTextField
              className="w-full"
              size="small"
              variant="filled"
              rows={3}
              placeholder="본문 내용을 직접 입력하거나, 하단의 AI 생성 프롬포트를 사용하여 AI가 생성하도록 할 수 있습니다."
              hiddenLabel
              multiline
              fullWidth
              value={localDraftContent}
              onChange={(e) => {
                setLocalDraftContent(e.target.value);
                debouncedUpdate("draftContent", e.target.value);
              }}
              disabled={isGenerating || isConfirmed}
              slotProps={{
                input: {
                  "aria-label": "생성 초안",
                },
              }}
            />
          </fieldset>

          <fieldset onMouseDown={() => setIsDraggable(false)}>
            <legend className="text-sm mb-1">AI 생성 프롬프트</legend>
            <CustomTextField
              className="w-full"
              size="small"
              variant="filled"
              rows={3}
              placeholder="AI가 생성할 내용에 대한 구체적인 지시사항을 입력하세요. 예: '고객 성공 사례 3가지를 포함하여 작성'"
              multiline
              hiddenLabel
              fullWidth
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating || isConfirmed}
              slotProps={{
                input: {
                  "aria-label": "AI 생성 프롬프트",
                },
              }}
            />
          </fieldset>

          <div
            className="flex items-center justify-between gap-2"
            onMouseDown={() => setIsDraggable(false)}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AutoIcon aria-hidden="true" />}
                size="small"
                onClick={() => generateContent(aiPrompt)}
                disabled={isGenerating || !aiPrompt.trim() || isConfirmed}
                aria-label="AI로 초안 생성"
              >
                {isGenerating ? "생성 중..." : "기본 생성"}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<ReplayIcon aria-hidden="true" />}
                size="small"
                onClick={() => generateContent(aiPrompt)}
                disabled={isGenerating || !aiPrompt.trim() || isConfirmed}
                aria-label="AI 초안 재생성"
              >
                재생성
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<CheckIcon aria-hidden="true" />}
                size="small"
                onClick={handleToggleConfirm}
                disabled={!localChapterBody || isGenerating}
                aria-label={
                  isConfirmed ? "초안 확정 해제" : "초안을 본문으로 확정"
                }
              >
                {isConfirmed ? "확정 해제" : "확정"}
              </Button>
            </div>

            <Button
              color="error"
              startIcon={<SaveIcon aria-hidden="true" />}
              size="small"
              onClick={() => handleDeleteDialog(chapter.chapter_id)}
              disabled={isGenerating}
              aria-label="챕터 삭제"
            >
              삭제
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
