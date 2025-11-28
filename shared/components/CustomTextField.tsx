"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

type CustomTextFieldProps = Omit<TextFieldProps, "variant"> & {
  variant?: "filled" | "outlined" | "standard";
};

/**
 * 프로젝트 디자인 시스템에 맞게 커스터마이징된 TextField 컴포넌트
 *
 * 기본 스타일:
 * - filled variant 사용 시 둥근 모서리와 커스텀 배경색 적용
 * - border 제거 (before, after, hover, focus 상태 모두)
 */
export const CustomTextField = forwardRef<HTMLDivElement, CustomTextFieldProps>(
  ({ variant = "filled", sx, ...props }, ref) => {
    const defaultSx =
      variant === "filled"
        ? {
            "& .MuiFilledInput-root": {
              borderRadius: "8px",
              backgroundColor: "oklch(96.7% 0.003 264.542)",
            },
            "& .MuiFilledInput-root:before, & .MuiFilledInput-root:after": {
              borderBottom: "none",
            },
            "& .MuiFilledInput-root:hover:not(.Mui-disabled .Mui-error):before":
              {
                borderBottom: "none",
              },

            "& .MuiFilledInput-root.Mui-focused:before, & .MuiFilledInput-root.Mui-focused:after":
              {
                borderBottom: "none",
              },
            "& .MuiFilledInput-root.Mui-focused": {
              border: "1px solid #bbb",
            },

            ...sx,
          }
        : sx;

    return <TextField ref={ref} variant={variant} sx={defaultSx} {...props} />;
  }
);

CustomTextField.displayName = "CustomTextField";
