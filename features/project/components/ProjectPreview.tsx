"use client";

import dayjs from "dayjs";
import { useProjectStore } from "../store/useProjectStore";
import type { CSSProperties } from "react";
import { useUserStore } from "@/shared/store/useUserStore";

// A4 사이즈 상수 (MS Word 기본값 - 96 DPI 기준)
const A4_SIZE = {
  WIDTH: 794, // 210mm
  PADDING: 96, // 2.54cm (1인치) - MS Word 기본 여백
} as const;

interface ProjectPreviewProps {
  className?: string;
}

export const ProjectPreview = ({ className }: ProjectPreviewProps) => {
  const { project } = useProjectStore();
  const { user } = useUserStore();

  if (!project) {
    return (
      <div className={className}>
        <div className="bg-white shadow-lg p-10">
          <p className="text-gray-500 text-center">프로젝트 정보가 없습니다.</p>
        </div>
      </div>
    );
  }

  const containerStyle: CSSProperties = {
    width: `${A4_SIZE.WIDTH}px`,
    boxSizing: "border-box",
  };

  const contentStyle: CSSProperties = {
    padding: `${A4_SIZE.PADDING}px`,
    boxSizing: "border-box",
    fontFamily: "'Malgun Gothic', '맑은 고딕', sans-serif", // MS Word 한글 기본 폰트
    fontSize: "12pt", // MS Word 기본 폰트 크기
    lineHeight: "1.5", // MS Word 기본 줄간격
    color: "#000000", // 순수 검정색
  };

  return (
    <div className={className}>
      <div className="bg-white shadow-lg" style={containerStyle}>
        <div style={contentStyle}>
          {/* 제목 */}
          {project.project_name && (
            <h1
              style={{
                fontSize: "24pt", // MS Word 제목 1 크기
                fontWeight: "bold",
                marginBottom: "24pt",
                textAlign: "center",
                color: "#000000",
              }}
            >
              {project.project_name}
            </h1>
          )}

          {/* 날짜 */}
          {/* {project.updated_at && (
            <>
              <p
                style={{
                  fontSize: "12pt",
                  color: "#595959",
                  textAlign: "center",
                  marginBottom: "12pt",
                }}
              >
                {dayjs(project.updated_at).format("YYYY년 MM월 DD일")}
              </p>
            </>
          )} */}

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #000",
              margin: "18pt 0",
            }}
          />

          {/* 기업 정보 */}
          {/* {user?.company && (
            <div className="bg-slate-100 p-4 rounded-md mb-6">
              <p className="font-semibold mb-2">기업 정보</p>
              <div className="grid grid-cols-2 gap-2">
                {user.company.name && (
                  <div>
                    <p className="text-gray-500 text-xs">기업명</p>
                    <p className="text-sm">{user.company.name}</p>
                  </div>
                )}
                {user.company.description && (
                  <div>
                    <p className="text-gray-500 text-xs">기업설명</p>
                    <p className="text-sm">{user.company.description}</p>
                  </div>
                )}
                {user.company.foundedAt && (
                  <div>
                    <p className="text-gray-500 text-xs">설립일</p>
                    <p className="text-sm">{user.company.foundedAt}</p>
                  </div>
                )}
                {user.company.service && (
                  <div>
                    <p className="text-gray-500 text-xs">서비스</p>
                    <p className="text-sm">{user.company.service}</p>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {/* 챕터 목록 */}
          {project.chapters && project.chapters.length > 0 && (
            <div>
              {project.chapters.map((chapter, index) => {
                const content =
                  chapter.draftContent || chapter.chapter_body || "";

                // 제목도 없고 내용도 없으면 스킵
                if (!chapter.chapter_name && !content.trim()) return null;

                return (
                  <div
                    key={chapter.chapter_id}
                    style={{
                      marginTop: index === 0 ? "0" : "18pt", // 챕터 간 간격
                    }}
                  >
                    {/* 챕터 제목 */}
                    {chapter.chapter_name && (
                      <h2
                        style={{
                          fontSize: "16pt", // MS Word 제목 2 크기
                          fontWeight: "bold",
                          marginBottom: "8pt",
                          color: "#000000",
                        }}
                      >
                        {chapter.chapter_name}
                      </h2>
                    )}

                    {/* 챕터 본문 */}
                    {content.trim() && (
                      <div
                        style={{
                          fontSize: "12pt",
                          lineHeight: "1.5",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          color: "#000000",
                        }}
                      >
                        {content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 인쇄용 스타일 - MS Word 기본값 */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 2.54cm; /* MS Word 기본 여백 */
          }

          body {
            margin: 0;
            padding: 0;
            font-family: "Malgun Gothic", "맑은 고딕", sans-serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000000;
          }

          /* 페이지 나누기 방지 */
          h1,
          h2 {
            page-break-after: avoid;
          }

          /* 단락 사이 페이지 나누기 최소화 */
          p,
          div {
            orphans: 3;
            widows: 3;
          }
        }
      `}</style>
    </div>
  );
};
