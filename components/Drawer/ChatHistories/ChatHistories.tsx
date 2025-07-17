import { useChatHistoryStore } from "@/store/useChatHistoryStore";

import { List } from "@mui/material";
import ChatHistoryItem from "./ChatHistoryItem";

const ChatHistories = () => {
  const histories = useChatHistoryStore((state) => state.histories);

  return (
    <List component="div" disablePadding key="histories">
      {histories.map((item, index) => (
        <ChatHistoryItem key={`${item.title}-${index}`} item={item} />
      ))}
    </List>
  );
};

export default ChatHistories;
