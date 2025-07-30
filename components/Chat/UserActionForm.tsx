"use client";

import { useState } from "react";
import { useUserActionStore } from "@/store/useChatStore";
import { UserActionFormItem } from "@/types/Stream";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  styled,
  TextField,
} from "@mui/material";

const CustomField = styled(TextField)({
  "& label.Mui-focused": {
    color: "var(--point)",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "var(--point)",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "var(--point)",
    },
    "&:hover fieldset": {
      borderColor: "var(--point)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--point)",
    },
  },
});

interface UserActionFormProps {
  title?: string;
  desc?: string;
  isInput?: boolean;
  inputPlaceholder?: string;
}

const UserActionForm = ({
  title = "정확한 검색을 위해 추가 정보가 필요합니다.",
  desc = "참고할 문서를 직접 프롬프트창에서 입력하거나, 아래 후보 중에서 선택해 주세요!",
  isInput = true,
  inputPlaceholder = "참고할 문서를 입력해 주세요",
}: UserActionFormProps) => {
  const { form, resolve, close } = useUserActionStore();

  const [selectedItems, setSelectedItems] = useState<UserActionFormItem[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  if (!form || !form.items) return null;

  const toggleItem = (item: UserActionFormItem) => {
    const exists = selectedItems.find(
      (i) => i.title === item.title && i.title_kr === item.title_kr
    );
    if (exists) {
      setSelectedItems((prev) =>
        prev.filter(
          (i) => !(i.title === item.title && i.title_kr === item.title_kr)
        )
      );
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const isSelected = (item: UserActionFormItem) =>
    selectedItems.some(
      (i) => i.title === item.title && i.title_kr === item.title_kr
    );

  const handleSubmit = () => {
    resolve?.({ re_select_data: selectedItems, re_answer_data: searchText });
    setSelectedItems([]);
    setSearchText("");
    close();
  };

  const handleClose = () => {
    resolve?.({ re_select_data: [], re_answer_data: "" });
    setSelectedItems([]);
    setSearchText("");
    close();
  };

  return (
    <Dialog open fullWidth maxWidth="xs">
      <DialogTitle fontSize="medium">
        <strong>{title}</strong>
        <p>{desc}</p>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" flexWrap="wrap" className="gap-2">
          {form.items
            .filter((item) => item.title) // title이 없는 항목은 제외
            .map((item, index) => (
              <Chip
                color="primary"
                key={`${item.title}_${index}`}
                label={
                  item.title_kr
                    ? `${item.title} (${item.title_kr})`
                    : item.title
                }
                onClick={() => toggleItem(item)}
                sx={{
                  backgroundColor: isSelected(item) ? "var(--tag-bg)" : "#fff",
                  color: isSelected(item) ? "var(--tag-text)" : "#000",
                  border: "1px solid var(--tag-bg)",
                  px: 0.75,
                  py: 0.5,
                  "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "nowrap",
                  },
                }}
              />
            ))}
        </Stack>
        {isInput && (
          <CustomField
            fullWidth
            variant="outlined"
            placeholder={inputPlaceholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            sx={{
              mt: 2,
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} className="w-1/2">
          닫기
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={selectedItems.length === 0 && !searchText}
          className="w-1/2"
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserActionForm;
