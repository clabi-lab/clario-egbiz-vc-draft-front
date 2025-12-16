"use client";

import dayjs from "dayjs";
import { useProjectStore } from "../store/useProjectStore";
import type { CSSProperties } from "react";

// A4 사이즈 상수 (96 DPI 기준)
const A4_SIZE = {
  WIDTH: 794, // 210mm
  PADDING: 40,
} as const;

interface ProjectPreviewProps {
  className?: string;
}

export const ProjectPreview = ({ className }: ProjectPreviewProps) => {
  const { project } = useProjectStore();

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
  };

  return (
    <div className={className}>
      <div className="bg-white shadow-lg" style={containerStyle}>
        <div style={contentStyle}>
          {/* 제목 */}
          {project.project_name && (
            <h1 className="text-xl font-bold mb-2 text-center">
              {project.project_name}
            </h1>
          )}

          {/* 날짜 */}
          {project.updated_at && (
            <>
              <p className="text-sm text-gray-500 text-center mb-4">
                {dayjs(project.updated_at).format("YYYY년 MM월 DD일")}
              </p>
              <hr className="my-6 border-gray-300" />
            </>
          )}

          {/* 기업 정보 */}
          {project.company && (
            <div className="bg-slate-100 p-4 rounded-md mb-6">
              <p className="font-semibold mb-2">기업 정보</p>
              <div className="grid grid-cols-2 gap-2">
                {project.company.name && (
                  <div>
                    <p className="text-gray-500 text-xs">기업명</p>
                    <p className="text-sm">{project.company.name}</p>
                  </div>
                )}
                {project.company.description && (
                  <div>
                    <p className="text-gray-500 text-xs">기업설명</p>
                    <p className="text-sm">{project.company.description}</p>
                  </div>
                )}
                {project.company.foundedAt && (
                  <div>
                    <p className="text-gray-500 text-xs">설립일</p>
                    <p className="text-sm">{project.company.foundedAt}</p>
                  </div>
                )}
                {project.company.service && (
                  <div>
                    <p className="text-gray-500 text-xs">서비스</p>
                    <p className="text-sm">{project.company.service}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 챕터 목록 */}
          {project.chapters && project.chapters.length > 0 && (
            <div className="space-y-6">
              {project.chapters.map((chapter) => {
                const content =
                  chapter.draftContent || chapter.chapter_body || "";

                // 제목도 없고 내용도 없으면 스킵
                if (!chapter.chapter_name && !content.trim()) return null;

                return (
                  <div key={chapter.chapter_id}>
                    {/* 챕터 제목 */}
                    {chapter.chapter_name && (
                      <h2 className="text-xl font-semibold mb-2">
                        {chapter.chapter_name}
                      </h2>
                    )}

                    {/* 챕터 본문 */}
                    {content.trim() && (
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
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
