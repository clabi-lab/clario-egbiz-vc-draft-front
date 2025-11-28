"use client";

import dayjs from "dayjs";
import { Project } from "../types";

interface ProjectPreviewProps {
  project: Project | null;
  className?: string;
}

export const ProjectPreview = ({ project, className }: ProjectPreviewProps) => {
  // A4 고정 크기: 210mm x 297mm
  // 96 DPI 기준: 794px x 1123px
  const A4_WIDTH = 794; // px
  const A4_HEIGHT = 1123; // px

  return (
    <div
      className={`bg-white shadow-lg ${className}`}
      style={{
        width: `${A4_WIDTH}px`,
        height: `${A4_HEIGHT}px`,
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      {/* 문서 제목 */}
      {project?.title && (
        <h1 className="text-xl font-bold mb-2 text-center">{project.title}</h1>
      )}

      {project?.updatedAt && (
        <p className="text-sm text-gray-500 text-center">
          {dayjs(project?.updatedAt).format("YYYY년 MM월 DD일")}
        </p>
      )}

      <hr className="my-6 border-gray-300" />

      {/* 기업 정보 */}
      {project?.company && (
        <div className="bg-slate-100 p-4 rounded-md">
          <p>기업 정보</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-gray-500 text-xs">기업명</p>
              <p>{project.company.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">기업설명</p>
              <p>{project.company.description}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">설립일</p>
              <p>{project.company.foundedAt}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">서비스</p>
              <p>{project.company.service}</p>
            </div>
          </div>
        </div>
      )}

      {/* 챕터 목록 */}
      <div className="space-y-6 mt-6">
        {project?.chapters?.map((chapter, index) => (
          <div key={`preview-${chapter.title}-${index}`}>
            {/* 챕터 제목 */}
            {chapter.title && (
              <h2 className="text-xl font-semibold mb-2">{chapter.title}</h2>
            )}

            {/* 확정된 본문 또는 초안 */}
            {chapter.content && !chapter.draftContent && (
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {chapter.content}
              </div>
            )}

            {/* 생성 초안 */}
            {chapter.draftContent && (
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600">
                {chapter.draftContent}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
