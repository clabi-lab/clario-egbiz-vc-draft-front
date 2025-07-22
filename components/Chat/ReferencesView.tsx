"use client";

import clsx from "clsx";

import SearchIcon from "@mui/icons-material/Search";

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
    <div className={clsx(className, "bg-gray-100")}>
      {references.map((reference, index) => (
        <div
          key={`${reference}_${index}`}
          className={`text-sm leading-5 flex ${index === 0 ? "" : "mt-1"}`}
          onClick={() => onClick(reference.host[0])}
        >
          <div className="shrink-0">
            <SearchIcon fontSize="small" />
            <span className="whitespace-normal">출처 :</span>
          </div>
          <span className="ml-1">{reference.index_code}</span>
        </div>
      ))}
    </div>
  );
};

export default ReferencesView;
