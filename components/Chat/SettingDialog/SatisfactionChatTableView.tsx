import { useEffect, useState } from "react";

import dayjs from "dayjs";
import { base64Encode } from "@/utils/encoding";
import { getSatisfactionChatGroups } from "@/lib/indexedDB";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";

import { SatisfactionDBItem } from "@/types/indexedDB";

const columns: { label: string; key: keyof SatisfactionDBItem }[] = [
  { label: "메모 내용", key: "memo" },
  { label: "생성 일자", key: "createdDate" },
];

const SatisfactionChatTableView = () => {
  const [data, setData] = useState<SatisfactionDBItem[]>([]);

  useEffect(() => {
    getSatisfactionChatGroups().then(setData);
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
                  {key === "createdDate" ? (
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

export default SatisfactionChatTableView;
