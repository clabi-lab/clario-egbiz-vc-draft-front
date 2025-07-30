import SafeHTML from "@/lib/SafeHTML";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Reference } from "@/types/Chat";

interface ReferencesDetailDialogProps {
  reference: Reference;
  isOpen: boolean;
  onClose: () => void;
}

const LABEL_MAP_DEFAULT: Record<string, string> = {
  title: "중분류 코드",
  title_nm: "중분류 코드 명",
  code: "소분류 코드",
  code_nm: "소분류 코드 명",
  publication_year: "발행년도",
  depth1: "대분류",
  depth1_nm: "대분류 명",
  depth2: "중분류",
  depth2_nm: "중분류 명",
  depth3: "소분류",
  depth3_nm: "소분류 명",
  depth4: "세분류",
  depth4_nm: "세분류 명",
  depth5: "세세분류",
  depth5_nm: "세세분류 명",
  page_no: "페이지",
  type: "타입",
  context: "내용",
};

const LABEL_MAP_C1: Record<string, string> = {
  title: "중분류 코드",
  title_nm: "중분류 코드 명",
  code: "적용사례",
  subject: "제목",
  inquery: "질의",
  page_no: "페이지",
  type: "타입",
  no: "번호",
  context: "답변",
};

// 원래는 referencesType을 기반으로 라벨을 매핑해야 하나,
// 일정 등의 이유로 우선 프론트엔드에서 title 값으로 구분 처리함
// 추후 AI팀에 수정 요청해야함
const getLabelMap = (reference: Reference) =>
  reference.title === "C1" ? LABEL_MAP_C1 : LABEL_MAP_DEFAULT;

const getDisplayText = (reference: Reference, key: keyof Reference) => {
  const value = reference[key];
  if (!value) return "-";
  return `${value}`;
};

const cellBorderStyle = {
  border: "1px solid #e0e0e0",
};

const ReferencesDetailDialog = ({
  reference,
  isOpen,
  onClose,
}: ReferencesDetailDialogProps) => {
  const labelMap = getLabelMap(reference);
  const keys = Object.keys(labelMap) as (keyof Reference)[];

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle sx={{ padding: "16px 24px" }}>
        상세보기
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Table size="small" sx={cellBorderStyle}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  backgroundColor: "#ccc",
                  width: "30%",
                  ...cellBorderStyle,
                }}
              >
                구분
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  backgroundColor: "#ccc",
                  width: "70%",
                  ...cellBorderStyle,
                }}
              >
                내용
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {reference ? (
              keys.map((key) => (
                <TableRow key={key}>
                  <TableCell sx={cellBorderStyle}>
                    {labelMap[key] ?? key}
                  </TableCell>
                  <TableCell>
                    <SafeHTML
                      html={getDisplayText(reference, key).replace(
                        /\n/g,
                        "<br />"
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  저장된 데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ReferencesDetailDialog;
