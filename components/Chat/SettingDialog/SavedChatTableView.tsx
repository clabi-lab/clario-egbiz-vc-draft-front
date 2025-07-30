import { useEffect, useState } from "react";
import { getSavedChatGroups } from "@/lib/indexedDB";
import { IndexedDBItem } from "@/types/indexedDB";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";

const columns: { label: string; key: keyof IndexedDBItem }[] = [
  { label: "채팅 그룹명", key: "title" },
  { label: "생성 일자", key: "createdDate" },
];

const SavedChatTableView = () => {
  const [data, setData] = useState<IndexedDBItem[]>([]);

  useEffect(() => {
    getSavedChatGroups().then(setData);
  }, []);

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
                  {key === "createdDate"
                    ? dayjs(item.createdDate).format("YYYY-MM-DD HH:mm:ss")
                    : item[key]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default SavedChatTableView;
