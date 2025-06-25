import { useChatHistoryStore } from "@/store/useChatHistoryStore";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

const ChatHistoryList = () => {
  const { histories } = useChatHistoryStore();

  return (
    <List component="div" disablePadding key="histories">
      {histories.map((item, index) => (
        <ListItemButton
          sx={{ pl: 4, py: "2px" }}
          key={`${item.title}-${index}`}
        >
          <Link
            href={`/chat/${item.shareCode}`}
            className="w-[80%] flex align-center"
          >
            <ListItemText
              className="flex align-center truncate"
              primary={item.title}
            />
          </Link>
          <ListItemIcon
            className=""
            sx={{
              minWidth: "32px",
              display: "none",
              "&:hover": { display: "inline-flex" },
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("open");
            }}
          >
            <MoreHorizIcon sx={{ color: "white" }}></MoreHorizIcon>
          </ListItemIcon>
        </ListItemButton>
      ))}
    </List>
  );
};

export default ChatHistoryList;
