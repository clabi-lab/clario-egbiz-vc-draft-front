"use client";

import dayjs from "dayjs";
import { useProjectStore } from "../store/useProjectStore";

interface ProjectPreviewProps {
  className?: string;
}

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export const ProjectPreview = ({ className }: ProjectPreviewProps) => {
  const { project } = useProjectStore();

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
      {project?.project_name && (
        <h1 className="text-xl font-bold mb-2 text-center">
          {project.project_name}
        </h1>
      )}

      {project?.updated_at && (
        <p className="text-sm text-gray-500 text-center">
          {dayjs(project?.updated_at).format("YYYY년 MM월 DD일")}
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
          <div key={`preview-${chapter.chapter_name}-${index}`}>
            {/* 챕터 제목 */}
            {chapter.chapter_name && (
              <h2 className="text-xl font-semibold mb-2">
                {chapter.chapter_name}
              </h2>
            )}

            {/* 본문 내용 */}
            {(chapter.chapter_body || chapter.draftContent) && (
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {chapter.chapter_body || chapter.draftContent}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
