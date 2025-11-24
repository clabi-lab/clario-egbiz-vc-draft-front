"use client";

import { useState } from "react";
import clsx from "clsx";

import { Button } from "@mui/material";
import ReferencesDetailDialog from "./ReferencesDetailDialog";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { Reference } from "@/types/Chat";

interface ReferencesViewProps {
  references: Reference[];
  className?: string;
}

const ReferencesView = ({ references, className }: ReferencesViewProps) => {
  const [selectedReference, setSelectedReference] = useState<Reference | null>(
    null
  );
  const [showAll, setShowAll] = useState(false);

  const handleCloseDialog = () => {
    setSelectedReference(null);
  };

  const displayedReferences = showAll ? references : references.slice(0, 5);
  const hasMore = references.length > 5;

  return (
    <section
      className={clsx(className, "bg-gray-100 px-4 py-3")}
      role="region"
      aria-labelledby="references-title"
    >
      <h4 id="references-title" className="sr-only">
        참고 자료
      </h4>
      <ul>
        {displayedReferences.map((reference, index) => (
          <li
            key={`${reference.index_code}_${index}`}
            className="flex items-start justify-between"
          >
            <div
              className={`text-sm leading-5 md:flex inline-flex ${
                index === 0 ? "" : "mt-1"
              }`}
            >
              <div className="shrink-0">
                <span className="whitespace-normal">🔍 참고 문서 :</span>
              </div>
              <span className="ml-1">
                {reference.index_code}{" "}
                <Button
                  className="shrink-0 underline"
                  sx={{
                    py: 0,
                    display: {
                      xs: "inline",
                      md: "none",
                    },
                  }}
                  endIcon={<OpenInNewIcon sx={{ width: "16px" }} />}
                  onClick={() => setSelectedReference(reference)}
                  aria-label={`${reference.index_code} 상세보기`}
                >
                  <span className="underline">상세보기</span>
                </Button>
              </span>
            </div>
            <Button
              className="shrink-0 underline inline"
              sx={{
                marginLeft: 1,
                py: 0,
                display: {
                  xs: "none",
                  md: "inline-flex",
                },
              }}
              endIcon={<OpenInNewIcon sx={{ width: "16px" }} />}
              onClick={() => setSelectedReference(reference)}
              aria-label={`${reference.index_code} 상세보기`}
            >
              <span className="underline">상세보기</span>
            </Button>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="mt-2 text-center">
          <Button
            onClick={() => setShowAll(!showAll)}
            sx={{
              py: 0.5,
              px: 2,
              fontSize: "0.875rem",
              textTransform: "none",
            }}
          >
            {showAll ? "접기" : `더보기 (${references.length - 5}개)`}
          </Button>
        </div>
      )}

      {selectedReference && (
        <ReferencesDetailDialog
          reference={selectedReference}
          isOpen={!!selectedReference}
          onClose={handleCloseDialog}
        />
      )}
    </section>
  );
};

export default ReferencesView;
