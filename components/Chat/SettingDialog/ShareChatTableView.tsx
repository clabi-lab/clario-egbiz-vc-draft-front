import { useEffect, useState } from "react";
import { deleteShareChatGroups, getShareChatGroups } from "@/lib/indexedDB";
import { ShareDBItem } from "@/types/indexedDB";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { useAlertStore } from "@/store/useAlertStore";

type ShareColumnKey = keyof ShareDBItem | "delete";

const columns: { label: string; key: ShareColumnKey }[] = [
  { label: "채팅 그룹명", key: "title" },
  { label: "공유된 일자", key: "createdDate" },
  { label: "삭제", key: "delete" },
];

const ShareChatTableView = () => {
  const openAlert = useAlertStore((state) => state.openAlert);

  const [data, setData] = useState<ShareDBItem[]>([]);

  const fetchData = async () => {
    try {
      const result = await getShareChatGroups();
      setData(result);
    } catch {
      openAlert({
        severity: "error",
        message: "데이터를 불러오는 데 실패했습니다.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteShareChatGroups(id);
      await fetchData();

      openAlert({
        severity: "success",
        message: "성공적으로 삭제되었습니다.",
      });
    } catch {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map(({ label, key }) => (
            <TableCell key={key}>{label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} sx={{ textAlign: "center" }}>
              저장된 데이터가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, rowIdx) => (
            <TableRow key={item.chatGroupId ?? rowIdx}>
              {columns.map(({ key }, colIdx) => (
                <TableCell key={colIdx}>
                  {key === "delete" ? (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(item.chatGroupId)}
                    >
                      삭제
                    </Button>
                  ) : key === "createdDate" ? (
                    dayjs(item.createdDate).format("YYYY-MM-DD HH:mm:ss")
                  ) : (
                    item[key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ShareChatTableView;
