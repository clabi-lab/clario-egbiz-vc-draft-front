"use client";

import SearchIcon from "@mui/icons-material/Search";

import { Reference } from "@/types/Chat";

interface ReferencesViewProps {
  references: Reference[];
  className: string;
  onClick: (item: string) => void;
}

const ReferencesView: React.FC<ReferencesViewProps> = ({
  references,
  className,
  onClick,
}) => {
  return (
    <div className={className}>
      {references.map((reference, index) => (
        <div
          key={`${reference}_${index}`}
          className="text-sm leading-6"
          onClick={() => onClick(reference.host[0])}
        >
          <SearchIcon fontSize="small" />
          <span>출처 : </span>
          <span>{`[${reference.title}/${reference.title_nm}]`}</span>
        </div>
      ))}
    </div>
  );
};

export default ReferencesView;
