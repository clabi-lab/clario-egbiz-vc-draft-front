import { useEffect, useState } from "react";

import dayjs from "dayjs";
import { base64Encode } from "@/utils/encoding";
import { deleteMemoGroup, getMemoChatGroups } from "@/lib/indexedDB";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";

import { MemoDBItem } from "@/types/indexedDB";
import { useAlertStore } from "@/store/useAlertStore";
import { deleteMemo } from "@/services/chatService";

const columns: { label: string; key: keyof MemoDBItem | "delete" }[] = [
  { label: "메모 내용", key: "memo" },
  { label: "생성 일자", key: "createdDate" },
  { label: "삭제", key: "delete" },
];

const MemoChatTableView = () => {
  const openAlert = useAlertStore((state) => state.openAlert);

  const [data, setData] = useState<MemoDBItem[]>([]);

  const fetchData = async () => {
    try {
      const result = await getMemoChatGroups();
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

  const handleDelete = async (chatId: number, memoId: number) => {
    try {
      await deleteMemo(memoId);
      await deleteMemoGroup(chatId);
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
            <TableRow key={rowIdx}>
              {columns.map(({ key }, colIdx) => (
                <TableCell key={colIdx}>
                  {key === "delete" ? (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(item.chatId, item.memoId)}
                    >
                      삭제
                    </Button>
                  ) : key === "createdDate" ? (
                    dayjs(item.createdDate).format("YYYY-MM-DD HH:mm:ss")
                  ) : (
                    <Link
                      href={`/chat/${base64Encode(
                        JSON.stringify(item.chatGroupId)
                      )}`}
                    >
                      {item[key]}
                    </Link>
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

export default MemoChatTableView;
