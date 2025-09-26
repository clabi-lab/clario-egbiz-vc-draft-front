import { useState } from "react";

import { getAllChatGroups } from "@/lib/indexedDB";
import { useChatHistoryStore } from "@/store/useChatHistoryStore";

import ChatHistoryMenu from "./ChatHistoryMenu";
import EditingInput from "./InputItem";
import ListItemContainer from "./ButtonItem";

import type { ChatHistoryItem } from "@/types/Chat";

interface ChatHistoryItemProps {
  item: ChatHistoryItem;
}

const ChatHistoryItem = ({ item }: ChatHistoryItemProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const setHistories = useChatHistoryStore((state) => state.setHistories);

  const isMenuOpen = Boolean(menuAnchorEl);

  const startEditing = () => {
    setIsEditing(true);
  };

  const handleMenu = (event?: React.MouseEvent<HTMLElement>) => {
    if (event) {
      event.stopPropagation();
      setMenuAnchorEl(event.currentTarget);
    } else {
      setMenuAnchorEl(null);
    }
  };

  const handleRefreshHistory = async () => {
    try {
      const list = await getAllChatGroups();
      setHistories(list);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to refresh history:", error);
    }
  };

  return (
    <>
      {isEditing ? (
        <EditingInput item={item} onClose={handleRefreshHistory} />
      ) : (
        <ListItemContainer
          item={item}
          editedTitle={item.title}
          isMenuOpen={isMenuOpen}
          onMenuClick={handleMenu}
        />
      )}

      <ChatHistoryMenu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={() => handleMenu()}
        item={item}
        startEditing={startEditing}
        refreshHistory={handleRefreshHistory}
      />
    </>
  );
};

export default ChatHistoryItem;
