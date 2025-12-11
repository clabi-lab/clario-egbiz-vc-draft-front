import { useState, useEffect, useRef } from "react";

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
import SendIcon from "@mui/icons-material/Send";

import {
  updateChapter,
  deleteChapter,
  createChapter,
  createProject,
  rewriteChapter,
  addChapter,
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
    updateLocalChapter,
    updateChapterField,
    removeLocalChapter,
  } = useProjectStore();
  const { user } = useUserStore();

  const { openDialog } = useDialogStore();
  const { openAlert } = useAlertStore();

  useEffect(() => {
    setLocalChapterName(chapter.chapter_name || "");
    setLocalChapterBody(chapter.chapter_body || "");
    setLocalDraftContent(chapter.draftContent || "");
  }, [chapter.chapter_name, chapter.chapter_body, chapter.draftContent]);

  useEffect(() => {
    return () => {
      Object.values(debounceTimerRef.current).forEach((timer) =>
        clearTimeout(timer)
      );
    };
  }, []);

  const debouncedUpdate = (field: keyof Chapter, value: string) => {
    if (debounceTimerRef.current[field]) {
      clearTimeout(debounceTimerRef.current[field]);
    }

    debounceTimerRef.current[field] = setTimeout(() => {
      updateChapterField(index, field, value);
    }, 300);
  };

  const showAlert = (
    message: string,
    severity: "success" | "error" | "info",
    openTime = 2000
  ) => {
    openAlert({ message, severity, openTime });
  };

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
      removeLocalChapter(chapter_id);
      showAlert("챕터가 삭제되었습니다.", "success");
    } catch (error) {
      console.error("챕터 삭제 오류:", error);
      showAlert("챕터 삭제 중 오류가 발생했습니다.", "error", 3000);
    }
  };

  const handleToggleConfirm = () => {
    if (isConfirmed) {
      setIsConfirmed(false);
      showAlert("본문 확정이 해제되었습니다.", "info");
      return;
    }

    const updatedChapter = {
      ...chapter,
      chapter_name: localChapterName,
      chapter_body: localDraftContent ?? localChapterBody,
      draftContent: "",
    };

    if (chapter.chapter_id) {
      handleUpdateChapter(updatedChapter);
    } else if (project) {
      handleCreateChapter(updatedChapter);
    }
  };

  const handleUpdateChapter = async (chapter: Chapter) => {
    try {
      await updateChapter(chapter.chapter_id, {
        chapter_name: chapter.chapter_name,
        chapter_body: chapter.chapter_body || "",
        ai_create_count: chapter.ai_create_count,
        token_count: chapter.token_count || 0,
      });

      setIsConfirmed(true);
      updateLocalChapter(index, chapter);
      showAlert("초안이 본문으로 확정되었습니다.", "success");
    } catch (error) {
      console.error("챕터 확정 오류:", error);
      showAlert("챕터 확정 중 오류가 발생했습니다.", "error", 3000);
    }
  };

  const handleCreateChapter = async (chapter: Chapter) => {
    try {
      let projectId = project?.project_id;

      if (!projectId) {
        const response = await createProject({
          user_id: user?.user_id || "",
          biz_name: user?.company?.name || "",
          pdf_yn: false,
          project_name: project?.project_name,
          chapters: project?.chapters || [],
        });
        projectId = response.project_id;
      }

      if (projectId) {
        await createChapter(projectId, chapter);
      }

      setIsConfirmed(true);
      showAlert("챕터가 생성되었습니다.", "success");
    } catch (error) {
      console.error("챕터 생성 오류:", error);
      showAlert("챕터 생성 중 오류가 발생했습니다.", "error", 3000);
    }
  };

  const resetDraftContent = () => {
    setLocalDraftContent("");
    updateChapterField(index, "draftContent", "");
  };

  const setGeneratedContent = (content: string) => {
    setLocalDraftContent(content);
    updateChapterField(index, "draftContent", content);
    setIsGenerating(false);
    setAiPrompt("");
  };

  const generateContent = async (prompt: string) => {
    setIsGenerating(true);
    resetDraftContent();

    const response = await addChapter({
      project_name: project?.project_name || "",
      user_id: user?.user_id || "",
      biz_name: user?.company?.name || "",
      project_id: project?.project_id?.toString() || "",
      chapter_name: chapter.chapter_name || "",
    });

    setGeneratedContent(response[0].chapter_body);
  };

  const regenerateContentWithClario = async (prompt: string) => {
    if (!project?.project_id) {
      showAlert("프로젝트 정보를 찾을 수 없습니다.", "error");
      return;
    }

    setIsGenerating(true);
    resetDraftContent();

    const response = await rewriteChapter({
      project_name: project.project_name || "",
      user_id: user?.user_id || "",
      biz_name: user?.company?.name || "",
      project_id: project.project_id.toString(),
      chapter_id: chapter.chapter_id,
      chapter_name: chapter.chapter_name || "",
      generation_count: 0,
      user_prompt: prompt,
    });

    setGeneratedContent(response[0].chapter_body);
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
    showAlert("챕터 순서가 변경되었습니다.", "success");
  };

  const handleDragEnterEvent = () => {
    handleDragEnter(index);
    setIsDragOver(true);
  };

  const handleChapterNameChange = (value: string) => {
    setLocalChapterName(value);
    debouncedUpdate("chapter_name", value);
  };

  const handleChapterBodyChange = (value: string) => {
    setLocalChapterBody(value);
    debouncedUpdate("chapter_body", value);
  };

  const handleDraftContentChange = (value: string) => {
    setLocalDraftContent(value);
    debouncedUpdate("draftContent", value);
  };

  const getChapterClassName = () => {
    const classes = [
      "rounded-md p-4 flex flex-col gap-4 my-4 transition-all",
      isConfirmed
        ? "bg-[#fafefc] border border-[#b9f8cf]"
        : "bg-white border border-gray-200",
      isDragOver ? "border-blue-500 bg-blue-50" : "",
    ];
    return classes.join(" ");
  };

  const isDisabledForGeneration = isGenerating || isConfirmed;

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
            onChange={(e) => handleChapterNameChange(e.target.value)}
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
              onChange={(e) => handleChapterBodyChange(e.target.value)}
              disabled={!!localChapterBody}
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
              onChange={(e) => handleDraftContentChange(e.target.value)}
              disabled={isDisabledForGeneration}
              loading={isGenerating}
              slotProps={{
                input: {
                  "aria-label": "생성 초안",
                },
              }}
            />
          </fieldset>

          <fieldset
            onMouseDown={() => setIsDraggable(false)}
            className="flex items-center justify-between gap-2"
          >
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
              disabled={isDisabledForGeneration}
              slotProps={{
                input: {
                  "aria-label": "AI 생성 프롬프트",
                },
              }}
            />
            <Button
              size="small"
              color="primary"
              variant="contained"
              className="h-[88px]"
              onClick={() => generateContent(aiPrompt)}
              disabled={isDisabledForGeneration}
              sx={{
                minWidth: "36px",
                "& .MuiSvgIcon-root": {
                  width: "20px",
                  height: "20px",
                  transform: "translateX(3px) rotate(-35deg)",
                },
              }}
            >
              <SendIcon aria-hidden="true" />
            </Button>
          </fieldset>

          <div
            className="flex items-center justify-between gap-2"
            onMouseDown={() => setIsDraggable(false)}
          >
            <div className="flex items-center gap-2 flex-wrap">
              {chapter.chapter_body ? (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ReplayIcon aria-hidden="true" />}
                    size="small"
                    onClick={() => regenerateContentWithClario(aiPrompt)}
                    disabled={isDisabledForGeneration}
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
                    disabled={isGenerating}
                    aria-label={
                      isConfirmed ? "초안 확정 해제" : "초안을 본문으로 확정"
                    }
                  >
                    {isConfirmed ? "확정 해제" : "확정"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AutoIcon aria-hidden="true" />}
                  size="small"
                  onClick={() => generateContent(aiPrompt)}
                  disabled={isDisabledForGeneration}
                  aria-label="AI로 초안 생성"
                >
                  {isGenerating ? "생성 중..." : "기본 생성"}
                </Button>
              )}
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
