import { useEffect } from "react";

import { useChatHistoryStore } from "@/store/useChatHistoryStore";
import { base64Decode } from "@/utils/encoding";

import { List } from "@mui/material";
import ChatHistoryItem from "./ChatHistoryItem";
import { usePathname } from "next/navigation";

const ChatHistories = () => {
  const histories = useChatHistoryStore((state) => state.histories);
  const pathname = usePathname();
  const setSelectedId = useChatHistoryStore((state) => state.setSelectedId);

  useEffect(() => {
    const segment = pathname.split("/").filter(Boolean);

    if (segment[0] === "chat" && segment[1]) {
      setSelectedId(Number(base64Decode(segment[1])));
    } else {
      setSelectedId(null);
    }
  }, [pathname]);

  return (
    <List component="div" disablePadding key="histories">
      {histories.map((item, index) => (
        <ChatHistoryItem key={`${item.title}-${index}`} item={item} />
      ))}
    </List>
  );
};

export default ChatHistories;
