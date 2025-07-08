import { useState } from "react";
import { ListItemButton, ListItemIcon, styled } from "@mui/material";

import {
  deleteChatGroup,
  getAllChatGroups,
  savedChatGroup,
  updateChatGroup,
} from "@/lib/indexedDB";
import { useChatHistoryStore } from "@/store/useChatHistoryStore";

import { ChatHistoryTextOrInput } from "./ChatHistoryTextOrInput";
import ChatHistoryMenu from "./ChatHistoryMenu";

import {
  DeleteOutline as DeleteIcon,
  BookmarkBorder as BookmarkIcon,
  DriveFileRenameOutline as RenameIcon,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";

import { History } from "@/types/ChatHistory";

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "isEditing",
})<{ isEditing: boolean }>(({ isEditing, theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingTop: "2px",
  paddingBottom: "2px",
  "&:hover .more-icon": {
    display: "inline-flex",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "transparent",
  },
  ...(isEditing
    ? {
        "&:hover": { backgroundColor: "transparent" },
      }
    : {
        "&:hover": {
          backgroundColor: "var(--drawer-hover-bg)",
          color: "var(--drawer-hover-text)",
        },
      }),
}));

const ChatHistoryItem = ({ item }: { item: History }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);

  const isMenuOpen = Boolean(menuAnchorEl);
  const { setHistories } = useChatHistoryStore();

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };
  const closeMenu = () => setMenuAnchorEl(null);

  const refreshHistory = async () => {
    const list = await getAllChatGroups();
    setHistories(list);
  };

  const handleRename = () => {
    setIsEditing(true);
    closeMenu();
  };

  const handleSubmitRename = async () => {
    if (!editedTitle.trim()) return;
    await updateChatGroup({
      id: Number(item.id),
      title: editedTitle,
      shareCode: item.shareCode,
    });
    setIsEditing(false);
    refreshHistory();
  };

  const handleArchive = async () => {
    await savedChatGroup({
      id: Number(item.id),
      title: item.title,
      shareCode: item.shareCode,
    });
    closeMenu();
  };

  const handleDelete = async () => {
    await deleteChatGroup(Number(item.id));
    refreshHistory();
    closeMenu();
  };

  return (
    <>
      <StyledListItemButton isEditing={isEditing}>
        <ChatHistoryTextOrInput
          isEditing={isEditing}
          editedTitle={editedTitle}
          shareCode={item.shareCode}
          onChange={setEditedTitle}
          onSubmit={handleSubmitRename}
          itemId={item.id}
        />

        {!isEditing && (
          <ListItemIcon
            className="more-icon ml-2"
            sx={{
              minWidth: 24,
              display: "none",
              cursor: "pointer",
            }}
            onClick={openMenu}
          >
            <MoreIcon sx={{ color: "white" }} />
          </ListItemIcon>
        )}
      </StyledListItemButton>

      <ChatHistoryMenu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={closeMenu}
        actions={[
          {
            icon: <RenameIcon fontSize="small" />,
            label: "제목 변경",
            onClick: handleRename,
          },
          {
            icon: <BookmarkIcon fontSize="small" />,
            label: "이력 보관",
            onClick: handleArchive,
          },
          {
            icon: <DeleteIcon fontSize="small" />,
            label: "삭제",
            onClick: handleDelete,
          },
        ]}
      />
    </>
  );
};

export default ChatHistoryItem;
