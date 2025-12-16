import { useState } from "react";

import { Button, IconButton } from "@mui/material";
import { CustomTextField } from "@/shared/components/CustomTextField";
import { Chapter } from "@/features/project/types";
import { useProjectStore } from "@/features/project/store/useProjectStore";
import { useDialogStore } from "@/shared/store/useDialogStore";
import { useAlertStore } from "@/shared/store/useAlertStore";
import { useUserStore } from "@/shared/store/useUserStore";

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
  updateTokenCount,
} from "../services/project";

interface ChapterItemProps {
  index: number;
}

const DEFAULT_CHAPTER: Chapter = {
  ai_create_count: 0,
  token_count: 0,
  chapter_body: "",
  draftContent: "",
  chapter_id: 0,
  chapter_name: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const ChapterItem = ({ index }: ChapterItemProps) => {
  const { project, updateLocalChapter, removeLocalChapter } = useProjectStore();
  const { user } = useUserStore();
  const { openDialog } = useDialogStore();
  const { openAlert } = useAlertStore();

  const chapter = project?.chapters?.[index] || DEFAULT_CHAPTER;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [chapterNameError, setChapterNameError] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(!!chapter?.chapter_body);

  // chapter 업데이트 헬퍼
  const handleChapterChange = (updates: Partial<Chapter>) => {
    updateLocalChapter(index, updates);
  };

  // Alert 헬퍼
  const showAlert = (
    message: string,
    severity: "success" | "error" | "info",
    openTime = 2000
  ) => {
    openAlert({ message, severity, openTime });
  };

  // 챕터 삭제 핸들러
  const handleDeleteChapter = async (chapter_id: number) => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      if (chapter_id !== 0) {
        await deleteChapter(chapter_id);
      }
      removeLocalChapter(chapter_id);
      showAlert("챕터가 삭제되었습니다.", "success");
    } catch (error) {
      console.error("챕터 삭제 오류:", error);
      showAlert("챕터 삭제 중 오류가 발생했습니다.", "error", 3000);
    } finally {
      setIsGenerating(false);
    }
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

  // 챕터 확정/해제 핸들러
  const handleToggleConfirm = () => {
    if (isConfirmed) {
      setIsConfirmed(false);
      showAlert("본문 확정이 해제되었습니다.", "info");
      return;
    }

    const updatedChapter: Chapter = {
      ...chapter,
      chapter_body: chapter.draftContent || chapter.chapter_body,
      draftContent: "",
    };

    if (chapter?.chapter_id) {
      handleUpdateChapter(updatedChapter);
    } else if (project) {
      handleCreateChapter(updatedChapter);
    }
  };

  // 챕터 업데이트 (기존 챕터 확정)
  const handleUpdateChapter = async (updatedChapter: Chapter) => {
    setIsGenerating(true);
    try {
      await updateChapter(updatedChapter.chapter_id, {
        chapter_name: updatedChapter.chapter_name,
        chapter_body: updatedChapter.chapter_body || "",
        ai_create_count: updatedChapter.ai_create_count,
        token_count: updatedChapter.token_count || 0,
      });

      handleChapterChange(updatedChapter);
      showAlert("초안이 본문으로 확정되었습니다.", "success");
    } catch (error) {
      console.error("챕터 확정 오류:", error);
      showAlert("챕터 확정 중 오류가 발생했습니다.", "error", 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // 챕터 생성 (신규 챕터 확정)
  const handleCreateChapter = async (newChapter: Chapter) => {
    setIsGenerating(true);
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
        const chapterResponse = await createChapter(projectId, newChapter);
        handleChapterChange({
          ...newChapter,
          chapter_id: chapterResponse.chapter_id,
        });
      }

      showAlert("챕터가 생성되었습니다.", "success");
    } catch (error) {
      console.error("챕터 생성 오류:", error);
      showAlert("챕터 생성 중 오류가 발생했습니다.", "error", 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // AI 콘텐츠 생성 (최초 생성)
  const generateContent = async () => {
    if (!project?.project_id) {
      showAlert("프로젝트 정보를 찾을 수 없습니다.", "error");
      return;
    }

    if (!chapter.chapter_name?.trim()) {
      setChapterNameError(true);
      showAlert("챕터 제목을 입력해주세요.", "error");
      return;
    }

    if (isGenerating) return;

    setIsGenerating(true);

    try {
      const response = await addChapter({
        project_id: project.project_id,
        chapter_name: chapter.chapter_name,
      });

      const chapterResponse = await createChapter(
        project.project_id,
        response[0]
      );

      await updateTokenCount(
        chapterResponse.chapter_id,
        response[0].token_count,
        response[0].ai_create_count
      );

      handleChapterChange({
        ...response[0],
        chapter_id: chapterResponse.chapter_id,
      });
      showAlert("챕터가 생성되었습니다.", "success");
    } catch (error) {
      console.error("콘텐츠 생성 오류:", error);
      showAlert("콘텐츠 생성 중 오류가 발생했습니다.", "error", 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // AI 콘텐츠 재생성
  const regenerateContent = async (prompt: string) => {
    if (!project?.project_id) {
      showAlert("프로젝트 정보를 찾을 수 없습니다.", "error");
      return;
    }

    if (isGenerating) return;

    setIsGenerating(true);

    try {
      const response = await rewriteChapter({
        project_id: project.project_id,
        chapter_id: chapter.chapter_id,
        chapter_name: chapter.chapter_name || "",
        confirmed_text: chapter.chapter_body || "",
        draft_text: chapter.draftContent || "",
        user_prompt: prompt,
      });

      await updateTokenCount(
        chapter.chapter_id,
        response[0].token_count,
        response[0].ai_create_count
      );

      handleChapterChange({ draftContent: response[0].chapter_body });
      setAiPrompt("");
      showAlert("콘텐츠가 재생성되었습니다.", "success");
    } catch (error) {
      console.error("콘텐츠 재생성 오류:", error);
      showAlert("콘텐츠 재생성 중 오류가 발생했습니다.", "error", 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Enter 키로 재생성 트리거
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      regenerateContent(aiPrompt);
    }
  };

  // 챕터 상태에 따른 CSS 클래스
  const chapterClassName = [
    "rounded-md p-4 flex flex-col gap-4 my-4 transition-all",
    isConfirmed
      ? "bg-[#fafefc] border border-[#b9f8cf]"
      : "bg-white border border-gray-200",
  ].join(" ");

  const isDisabledForGeneration = isGenerating || isConfirmed;

  return (
    <div className={chapterClassName}>
      <div className="flex items-center justify-between gap-2">
        <div className="w-full">
          <CustomTextField
            className="w-full"
            size="small"
            variant="filled"
            hiddenLabel
            value={chapter.chapter_name || ""}
            onChange={(e) => {
              handleChapterChange({ chapter_name: e.target.value });
              if (chapterNameError && e.target.value.trim()) {
                setChapterNameError(false);
              }
            }}
            fullWidth
            disabled={isConfirmed}
            error={chapterNameError}
            helperText={chapterNameError ? "챕터 제목을 입력해주세요." : ""}
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
          <fieldset>
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
              value={chapter.chapter_body || ""}
              disabled
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

          <fieldset>
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
              value={chapter.draftContent || ""}
              onChange={(e) =>
                handleChapterChange({ draftContent: e.target.value })
              }
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
            className="flex items-center justify-between gap-2"
            disabled={!chapter.chapter_body}
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
              onClick={() => regenerateContent(aiPrompt)}
              disabled={isDisabledForGeneration || !chapter.chapter_body}
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

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {chapter.chapter_body ? (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ReplayIcon aria-hidden="true" />}
                    size="small"
                    onClick={() => regenerateContent("")}
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
                  onClick={generateContent}
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
