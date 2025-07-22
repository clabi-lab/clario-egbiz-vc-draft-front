import { styled } from "@mui/material/styles";

import {
  Checkbox,
  FormControlLabel,
  ListItemButton,
  ListItemText,
} from "@mui/material";

// ListItemButton 공통 스타일
const BaseListItemButton = styled(ListItemButton)(({ theme }) => ({
  height: 30,
  paddingLeft: theme.spacing(2),
}));

// 전체 선택 항목 전용
export const SelectAllListItemButton = styled(BaseListItemButton)(
  ({ theme }) => ({
    marginTop: 4,
    marginLeft: theme.spacing(1.5),
  })
);

// 필터 항목 전용
export const FilterListItemButton = styled(BaseListItemButton, {
  shouldForwardProp: (prop) => prop !== "depth",
})<{ depth: number }>(({ theme, depth }) => ({
  paddingLeft: theme.spacing(depth + 3),
}));

// 폼 라벨 스타일
export const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  fontSize: "14px",
  marginRight: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
  "& .MuiFormControlLabel-label": {
    fontSize: "14px",
    marginRight: 0,
  },
}));

// 체크박스
export const StyledCheckbox = styled(Checkbox)(() => ({
  padding: 0,
  paddingRight: 12,
}));

// 리스트 텍스트
export const StyledListItemText = styled(ListItemText)(() => ({
  margin: 0,
}));
