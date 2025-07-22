"use client";

import { useEffect, useRef } from "react";

import { TextField, ListItemText, TextFieldProps } from "@mui/material";
import Link from "next/link";
import { base64Encode } from "@/utils/encoding";

interface Props {
  isEditing: boolean;
  editedTitle: string;
  itemId: string | number;
  id: number;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const textFieldStyles: TextFieldProps["sx"] = {
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  border: "none",
  margin: "2px -10px",
  padding: "0 10px",
  borderRadius: "6px",
  "& fieldset": {
    border: "none",
  },
};

export const ChatHistoryTextOrInput = ({
  isEditing,
  editedTitle,
  id,
  onChange,
  onSubmit,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const input = inputRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length); // 커서 마지막으로
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        onSubmit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, onSubmit]);

  if (isEditing) {
    return (
      <TextField
        variant="standard"
        inputRef={inputRef}
        value={editedTitle}
        size="small"
        fullWidth
        InputProps={{
          disableUnderline: true,
        }}
        sx={textFieldStyles}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
      />
    );
  }

  return (
    <Link
      href={`/chat/${base64Encode(JSON.stringify(id))}`}
      className="w-[calc(100%-32px)] flex items-center"
      passHref
    >
      <ListItemText
        primary={editedTitle}
        sx={{ maxWidth: 200 }}
        slotProps={{
          primary: {
            sx: {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            },
          },
        }}
      />
    </Link>
  );
};
