import { useEffect, useRef, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";

import { updateChatGroup } from "@/lib/indexedDB";
import { useAlertStore } from "@/store/useAlertStore";
import { ChatHistoryItem } from "@/types/Chat";

// Constants
const INPUT_STYLES: TextFieldProps["sx"] = {
  backgroundColor: "var(--drawer-hover-bg-secondary)",
  color: "var(--drawer-hover-text)",
  padding: "2px 16px 2px 32px",
  border: "none",
  "& fieldset": {
    border: "none",
  },
  ".MuiInputBase-input": {
    color: "var(--drawer-hover-text)",
    fontSize: "1rem",
    height: "32px",
    padding: "0",
  },
} as const;

interface InputItemProps {
  item: ChatHistoryItem;
  onClose: () => void;
}

const InputItem = ({ item, onClose }: InputItemProps) => {
  const openAlert = useAlertStore((state) => state.openAlert);

  const inputRef = useRef<HTMLInputElement>(null);
  const [editedTitle, setEditedTitle] = useState(item.title);

  const handleSubmitRename = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      openAlert({
        severity: "error",
        message: "제목을 입력해주세요.",
      });
      return;
    }

    try {
      await updateChatGroup({
        chatGroupId: Number(item.id),
        title: trimmedTitle,
        createdDate: new Date().toISOString(),
      });

      openAlert({
        severity: "success",
        message: "제목이 변경되었습니다.",
      });
      onClose();
    } catch (error) {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      handleSubmitRename(inputRef.current.value);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      const input = inputRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  // 키 입력 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmitRename((e.target as HTMLInputElement).value);
    }
  };

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
      sx={INPUT_STYLES}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default InputItem;
