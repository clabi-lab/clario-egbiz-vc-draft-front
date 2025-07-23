"use client";

import clsx from "clsx";
import { Reference } from "@/types/Chat";

interface ReferencesViewProps {
  references: Reference[];
  className: string;
  onClick: (item: string) => void;
}

const ReferencesView = ({
  references,
  className,
  onClick,
}: ReferencesViewProps) => {
  return (
    <div
      className={clsx(className, "bg-[#F1F1F1] px-6 py-4 rounded text-chat-sm")}
    >
      {references.map((reference, index) => (
        <div
          key={`${reference}_${index}`}
          className={`leading-5 flex ${index === 0 ? "" : "mt-1"}`}
          onClick={() => onClick(reference.host[0])}
        >
          <div className="shrink-0">
            <span className="text-[14px]">🔍</span>
            <span className="whitespace-normal ml-1">출처 :</span>
          </div>
          <span className="ml-1">{reference.index_code}</span>
        </div>
      ))}
    </div>
  );
};

export default ReferencesView;
