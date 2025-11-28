"use client";

import { useState } from "react";
import { Card, IconButton } from "@mui/material";
import { CompanyField } from "../types";

import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";

interface CompanyInfoCardProps {
  companyFields: CompanyField[];
  defaultOpen?: boolean;
  className?: string;
}

export const CompanyInfoCard = ({
  companyFields,
  className,
  defaultOpen = true,
}: CompanyInfoCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card
      className={`border border-blue-300 p-4 text-sm ${className}`}
      sx={{
        boxShadow: "none",
        borderRadius: "16px",
        backgroundColor: "#eff4ff",
      }}
      role="region"
      aria-label="기업 정보"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-blue-500 flex items-center justify-center">
            <DescriptionIcon
              sx={{ width: 16, height: 16, color: "white" }}
              aria-hidden="true"
            />
          </div>
          <span className="font-medium text-blue-900">기업정보</span>
        </div>
        <IconButton
          onClick={toggleOpen}
          aria-label={isOpen ? "기업정보 접기" : "기업정보 펼치기"}
          aria-expanded={isOpen}
          size="small"
        >
          {isOpen ? (
            <ArrowUpIcon sx={{ width: 16, height: 16 }} aria-hidden="true" />
          ) : (
            <ArrowDownIcon sx={{ width: 16, height: 16 }} aria-hidden="true" />
          )}
        </IconButton>
      </div>
      {isOpen && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {companyFields.map((field, index) => (
            <div
              key={`${field.label}-${index}`}
              className={`bg-white/70 border border-blue-100 rounded-md p-2 ${
                field.fullWidth ? "col-span-2" : ""
              }`}
            >
              <p className="text-gray-500 text-xs">{field.label}</p>
              <p>{field.value}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
