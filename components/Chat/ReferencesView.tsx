"use client";

import { useState } from "react";
import clsx from "clsx";

import { Button } from "@mui/material";
import ReferencesDetailDialog from "./ReferencesDetailDialog";

import SearchIcon from "@mui/icons-material/Search";
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

  const handleCloseDialog = () => {
    setSelectedReference(null);
  };

  return (
    <>
      <div className={clsx(className, "bg-gray-100 px-4 py-3")}>
        {references.map((reference, index) => (
          <div
            key={`${reference.index_code}_${index}`}
            className="flex items-start justify-between"
          >
            <div
              className={`text-sm leading-5 md:flex inline-flex ${
                index === 0 ? "" : "mt-1"
              }`}
            >
              <div className="shrink-0">
                <SearchIcon
                  sx={{
                    fontSize: "16px",
                  }}
                />
                <span className="whitespace-normal">출처 :</span>
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
            >
              <span className="underline">상세보기</span>
            </Button>
          </div>
        ))}
      </div>

      {selectedReference && (
        <ReferencesDetailDialog
          reference={selectedReference}
          isOpen={!!selectedReference}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};

export default ReferencesView;
