import React from "react";
import { useRouter } from "next/navigation";

import { CommonConfig } from "@/config/common";
import { deleteChatGroup, updateSavedChatGroup } from "@/lib/indexedDB";
import { useAlertStore } from "@/store/useAlertStore";
import { useChatHistoryStore } from "@/store/useChatHistoryStore";

import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  BookmarkBorder as BookmarkIcon,
  DriveFileRenameOutline as RenameIcon,
} from "@mui/icons-material";

import type { ChatHistoryItem } from "@/types/Chat";

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface ChatHistoryMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  item: ChatHistoryItem;
  startEditing: () => void;
  refreshHistory: () => Promise<void>;
  actions?: ActionItem[];
}

const ChatHistoryMenu = ({
  anchorEl,
  open,
  onClose,
  item,
  startEditing,
  refreshHistory,
  actions,
}: ChatHistoryMenuProps) => {
  const router = useRouter();
  const openAlert = useAlertStore((state) => state.openAlert);
  const selectedId = useChatHistoryStore((state) => state.selectedId);

  const itemId = Number(item.id);

  const handleRename = () => {
    startEditing();
    onClose();
  };

  const handleArchive = async () => {
    try {
      await updateSavedChatGroup({
        chatGroupId: itemId,
        title: item.title,
        createdDate: new Date().toISOString(),
      });

      openAlert({
        severity: "success",
        message: "질문 내역이 보관되었습니다.",
      });
      onClose();
    } catch (error) {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteChatGroup(itemId);
      await refreshHistory();

      openAlert({
        severity: "success",
        message: "질문 내역이 삭제되었습니다.",
      });
      onClose();

      if (selectedId === itemId) {
        router.push("/");
      }
    } catch (error) {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  const defaultActions: ActionItem[] = [
    {
      icon: <RenameIcon fontSize="small" />,
      label: "제목 변경",
      onClick: handleRename,
    },
  ];

  if (CommonConfig.isChatSetting && CommonConfig.isChatSave) {
    defaultActions.push({
      icon: <BookmarkIcon fontSize="small" />,
      label: "이력 보관",
      onClick: handleArchive,
    });
  }

  defaultActions.push({
    icon: <DeleteIcon fontSize="small" />,
    label: "삭제",
    onClick: handleDelete,
  });

  const menuActions = actions || defaultActions;

  const handleMenuItemClick = (actionOnClick: () => void) => {
    actionOnClick();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        list: {
          "aria-labelledby": "chat-history-actions",
          sx: {
            color: "var(--history-menu-text)",
            backgroundColor: "var(--history-menu-bg)",
          },
        },
      }}
    >
      {menuActions.map(({ icon, label, onClick }) => (
        <MenuItem key={label} onClick={() => handleMenuItemClick(onClick)}>
          <ListItemIcon sx={{ color: "var(--history-menu-text)" }}>
            {icon}
          </ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ChatHistoryMenu;
