"use client";

import dayjs from "dayjs";
import { useProjectStore } from "../store/useProjectStore";
import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { Company, Chapter } from "../types";

// A4 사이즈 상수 (96 DPI 기준)
const A4_SIZE = {
  WIDTH: 794, // 210mm
  HEIGHT: 1123, // 297mm
  PADDING: 40,
} as const;

// 텍스트 라인 높이 설정 (실측 기반)
const LINE_SETTINGS = {
  BASE_LINE_HEIGHT: 25, // text-sm leading-relaxed + 여유 공간
  TITLE_HEIGHT: 44, // text-xl font-bold mb-2
  DATE_HEIGHT: 36, // text-sm mb-4
  DIVIDER_HEIGHT: 48, // my-6 (24px * 2)
  COMPANY_INFO_HEIGHT: 200, // 기업 정보 카드 mb-6 포함
  CHAPTER_TITLE_HEIGHT: 44, // text-xl font-semibold mb-2
  CHAPTER_SPACING: 24, // space-y-6 (각 챕터마다)
} as const;

// 실제 사용 가능한 콘텐츠 높이 (padding + 여유 공간 고려)
const CONTENT_HEIGHT = A4_SIZE.HEIGHT - A4_SIZE.PADDING * 2 - 40;

interface ProjectPreviewProps {
  className?: string;
}

// 페이지 데이터 타입
interface PageData {
  title?: string;
  date?: string;
  company?: Company;
  chapters: Array<{
    chapter: Chapter;
    lines: string[];
    showTitle: boolean;
  }>;
}

export const ProjectPreview = ({ className }: ProjectPreviewProps) => {
  const { project } = useProjectStore();

  // 페이지 분할 로직
  const pages = useMemo<PageData[]>(() => {
    if (!project) return [{ chapters: [] }];

    const allPages: PageData[] = [];
    let currentPage: PageData = { chapters: [] };
    let currentHeight = 0;

    // 첫 페이지: 제목 추가
    if (project.project_name) {
      currentPage.title = project.project_name;
      currentHeight += LINE_SETTINGS.TITLE_HEIGHT;
    }

    // 날짜 추가
    if (project.updated_at) {
      currentPage.date = dayjs(project.updated_at).format("YYYY년 MM월 DD일");
      currentHeight += LINE_SETTINGS.DATE_HEIGHT + LINE_SETTINGS.DIVIDER_HEIGHT;
    }

    // 기업 정보 추가
    if (project.company) {
      const spaceNeeded = LINE_SETTINGS.COMPANY_INFO_HEIGHT;
      if (currentHeight + spaceNeeded > CONTENT_HEIGHT) {
        allPages.push(currentPage);
        currentPage = { chapters: [] };
        currentHeight = 0;
      }
      currentPage.company = project.company;
      currentHeight += spaceNeeded;
    }

    // 챕터별로 처리
    if (project.chapters?.length) {
      for (const chapter of project.chapters) {
        const content = chapter.chapter_body || chapter.draftContent || "";
        const lines = content
          .split("\n")
          .filter((line) => line.trim() !== "" || content.includes("\n"));

        if (lines.length === 0 && !chapter.chapter_name) continue;

        let lineIndex = 0;
        let isFirstPartOfChapter = true;

        while (
          lineIndex < lines.length ||
          (isFirstPartOfChapter && chapter.chapter_name)
        ) {
          const titleHeight =
            isFirstPartOfChapter && chapter.chapter_name
              ? LINE_SETTINGS.CHAPTER_TITLE_HEIGHT
              : 0;
          const chapterSpacing =
            currentPage.chapters.length > 0 ? LINE_SETTINGS.CHAPTER_SPACING : 0;

          // 챕터 제목이 있을 때는 본문과 함께 배치하도록 개선
          const spaceNeeded = titleHeight + chapterSpacing;

          // 현재 페이지에 챕터 제목만이라도 넣을 공간이 있는지 확인
          if (
            currentHeight + spaceNeeded > CONTENT_HEIGHT &&
            currentPage.chapters.length > 0
          ) {
            allPages.push(currentPage);
            currentPage = { chapters: [] };
            currentHeight = 0;
            continue;
          }

          // 현재 페이지에 넣을 수 있는 라인 수 계산
          const usedSpacing =
            currentPage.chapters.length > 0 ? LINE_SETTINGS.CHAPTER_SPACING : 0;
          const availableHeight =
            CONTENT_HEIGHT - currentHeight - titleHeight - usedSpacing;
          const availableLines = Math.floor(
            availableHeight / LINE_SETTINGS.BASE_LINE_HEIGHT
          );

          const linesToAdd = Math.max(
            1,
            Math.min(availableLines, lines.length - lineIndex)
          );
          const pageLines = lines.slice(lineIndex, lineIndex + linesToAdd);

          // 챕터 데이터 추가
          if (
            pageLines.length > 0 ||
            (isFirstPartOfChapter && chapter.chapter_name)
          ) {
            currentPage.chapters.push({
              chapter,
              lines: pageLines,
              showTitle: isFirstPartOfChapter,
            });

            const actualHeight =
              titleHeight +
              usedSpacing +
              pageLines.length * LINE_SETTINGS.BASE_LINE_HEIGHT;

            currentHeight += actualHeight;
          }

          lineIndex += linesToAdd;
          isFirstPartOfChapter = false;

          if (lineIndex >= lines.length) break;

          // 페이지가 거의 찼으면 새 페이지
          if (
            currentHeight >
            CONTENT_HEIGHT - LINE_SETTINGS.BASE_LINE_HEIGHT * 3
          ) {
            allPages.push(currentPage);
            currentPage = { chapters: [] };
            currentHeight = 0;
          }
        }
      }
    }

    // 마지막 페이지 추가
    if (
      currentPage.title ||
      currentPage.company ||
      currentPage.chapters.length > 0
    ) {
      allPages.push(currentPage);
    }

    return allPages.length > 0 ? allPages : [{ chapters: [] }];
  }, [project]);

  const pageStyle: CSSProperties = {
    width: `${A4_SIZE.WIDTH}px`,
    height: `${A4_SIZE.HEIGHT}px`,
    boxSizing: "border-box",
    pageBreakAfter: "always",
  };

  const contentStyle: CSSProperties = {
    padding: `${A4_SIZE.PADDING}px`,
    boxSizing: "border-box",
    height: "100%",
    overflow: "hidden",
  };

  return (
    <div className={className}>
      {pages.map((page, pageIndex) => (
        <div
          key={`page-${pageIndex}`}
          className="bg-white shadow-lg mb-4 relative"
          style={pageStyle}
        >
          <div style={contentStyle}>
            {/* 제목 (첫 페이지만) */}
            {page.title && (
              <h1 className="text-xl font-bold mb-2 text-center">
                {page.title}
              </h1>
            )}

            {/* 날짜 (첫 페이지만) */}
            {page.date && (
              <>
                <p className="text-sm text-gray-500 text-center mb-4">
                  {page.date}
                </p>
                <hr className="my-6 border-gray-300" />
              </>
            )}

            {/* 기업 정보 */}
            {page.company && (
              <div className="bg-slate-100 p-4 rounded-md mb-6">
                <p className="font-semibold mb-2">기업 정보</p>
                <div className="grid grid-cols-2 gap-2">
                  {page.company.name && (
                    <div>
                      <p className="text-gray-500 text-xs">기업명</p>
                      <p className="text-sm">{page.company.name}</p>
                    </div>
                  )}
                  {page.company.description && (
                    <div>
                      <p className="text-gray-500 text-xs">기업설명</p>
                      <p className="text-sm">{page.company.description}</p>
                    </div>
                  )}
                  {page.company.foundedAt && (
                    <div>
                      <p className="text-gray-500 text-xs">설립일</p>
                      <p className="text-sm">{page.company.foundedAt}</p>
                    </div>
                  )}
                  {page.company.service && (
                    <div>
                      <p className="text-gray-500 text-xs">서비스</p>
                      <p className="text-sm">{page.company.service}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 챕터 목록 */}
            <div className="space-y-6">
              {page.chapters.map((chapterData, chapterIndex) => (
                <div key={`page-${pageIndex}-chapter-${chapterIndex}`}>
                  {/* 챕터 제목 (해당 챕터의 첫 부분일 때만) */}
                  {chapterData.showTitle &&
                    chapterData.chapter.chapter_name && (
                      <h2 className="text-xl font-semibold mb-2">
                        {chapterData.chapter.chapter_name}
                      </h2>
                    )}

                  {/* 챕터 본문 (해당 페이지 분량만) */}
                  {chapterData.lines.length > 0 && (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {chapterData.lines.join("\n")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* 인쇄용 스타일 */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};
