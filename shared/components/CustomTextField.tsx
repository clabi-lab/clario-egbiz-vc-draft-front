"use client";

import { TextField, TextFieldProps, CircularProgress } from "@mui/material";
import { forwardRef } from "react";

type CustomTextFieldProps = Omit<TextFieldProps, "variant"> & {
  variant?: "filled" | "outlined" | "standard";
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  loading?: boolean;
};

/**
 * 프로젝트 디자인 시스템에 맞게 커스터마이징된 TextField 컴포넌트
 *
 * 기본 스타일:
 * - filled variant 사용 시 둥근 모서리와 커스텀 배경색 적용
 * - border 제거 (before, after, hover, focus 상태 모두)
 */
export const CustomTextField = forwardRef<HTMLDivElement, CustomTextFieldProps>(
  (
    {
      variant = "filled",
      bgColor = "#f3f3f5",
      borderColor,
      sx,
      loading,
      slotProps,
      ...props
    },
    ref
  ) => {
    const defaultSx =
      variant === "filled"
        ? {
            "& .MuiFilledInput-root": {
              borderRadius: "8px",
              backgroundColor: bgColor,
              border: borderColor
                ? `1px solid ${borderColor}`
                : "1px solid transparent",
            },
            "& .MuiFilledInput-root:before, & .MuiFilledInput-root:after": {
              borderBottom: "none",
              borderBottomStyle: "unset",
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
              border: `1px solid #bbb`,
              backgroundColor: bgColor,
            },
            "& .MuiInputBase-root.MuiFilledInput-root.Mui-disabled": {
              backgroundColor: bgColor,
            },
            "& .MuiInputBase-root.MuiFilledInput-root.Mui-disabled:before": {
              borderBottom: "none",
              borderBottomStyle: "unset",
            },
            ...sx,
          }
        : sx;

    return (
      <div style={{ position: "relative", width: "100%" }}>
        <TextField
          ref={ref}
          variant={variant}
          sx={defaultSx}
          slotProps={{
            ...slotProps,
            input: {
              ...(slotProps?.input as any),
            },
          }}
          {...props}
        />
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <CircularProgress size={24} />
          </div>
        )}
      </div>
    );
  }
);

CustomTextField.displayName = "CustomTextField";
