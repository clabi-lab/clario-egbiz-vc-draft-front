import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  deleteChatGroup,
  getAllChatGroups,
  updateSavedChatGroup,
  updateChatGroup,
} from "@/lib/indexedDB";
import { useChatHistoryStore } from "@/store/useChatHistoryStore";
import { useAlertStore } from "@/store/useAlertStore";
import { base64Encode } from "@/utils/encoding";
import { useDrawerStore } from "@/store/useDrawerStore";
import { useIsMobile } from "@/hooks/useIsMobile";

import Link from "next/link";
import ChatHistoryMenu from "./ChatHistoryMenu";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  TextField,
  TextFieldProps,
} from "@mui/material";

import {
  DeleteOutline as DeleteIcon,
  BookmarkBorder as BookmarkIcon,
  DriveFileRenameOutline as RenameIcon,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";

import { CommonConfig } from "@/config/common";

import type { ChatHistoryItem } from "@/types/Chat";

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "isEditing" && prop !== "isSelected",
})<{ isEditing: boolean; isSelected: boolean }>(
  ({ isEditing, isSelected, theme }) => ({
    paddingLeft: theme.spacing(4),
    paddingTop: "2px",
    paddingBottom: "2px",
    "&:hover .more-icon": {
      display: "inline-flex",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "var(--drawer-hover-bg)",
      color: "var(--drawer-hover-text)",
    },
    ...(!isEditing && {
      "&:hover": {
        backgroundColor: "var(--drawer-hover-bg)",
        color: "var(--drawer-hover-text)",
      },
    }),
    ...(isSelected && {
      backgroundColor: "var(--drawer-hover-bg)",
      color: "var(--drawer-hover-text)",
    }),
  })
);

const textFieldStyles: TextFieldProps["sx"] = {
  backgroundColor: "var(--drawer-hover-bg)",
  color: "var(--drawer-hover-text)",
  margin: "3px 0 1px",
  border: "none",

  "& fieldset": {
    border: "none",
  },
  ".MuiInputBase-input": {
    color: "var(--drawer-hover-text)",
    fontSize: "1rem",
  },
};

const ChatHistoryItem = ({ item }: { item: ChatHistoryItem }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const isMenuOpen = Boolean(menuAnchorEl);
  const setHistories = useChatHistoryStore((state) => state.setHistories);
  const openAlert = useAlertStore((state) => state.openAlert);

  const inputRef = useRef<HTMLInputElement>(null);
  const setOpen = useDrawerStore((state) => state.setOpen);
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedId(Number(item.id));
  };
  const closeMenu = () => setMenuAnchorEl(null);

  useEffect(() => {
    if (pathname.includes(`/chat/${base64Encode(JSON.stringify(item.id))}`)) {
      setSelectedId(Number(item.id));
    } else {
      setSelectedId(null);
    }
  }, [pathname, item.id]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const input = inputRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length); // 커서 마지막으로
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleSubmitRename();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const refreshHistory = async () => {
    try {
      const list = await getAllChatGroups();
      setHistories(list);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRename = () => {
    setIsEditing(true);
    closeMenu();
  };

  const handleSubmitRename = async () => {
    try {
      if (!editedTitle.trim()) return;
      await updateChatGroup({
        chatGroupId: Number(item.id),
        title: editedTitle,
        createdDate: new Date().toISOString(),
      });
      setIsEditing(false);
      refreshHistory();
    } catch (error) {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  const handleArchive = async () => {
    try {
      await updateSavedChatGroup({
        chatGroupId: Number(item.id),
        title: item.title,
        createdDate: new Date().toISOString(),
      });
      closeMenu();
    } catch (error) {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteChatGroup(Number(item.id));
      refreshHistory();
      closeMenu();
      if (selectedId === Number(item.id)) {
        setSelectedId(null);
        router.push("/");
      }
    } catch (error) {
      openAlert({
        severity: "error",
        message: "잠시 후 다시 시도해주세요",
      });
    }
  };

  const handleActions = [
    {
      icon: <RenameIcon fontSize="small" />,
      label: "제목 변경",
      onClick: handleRename,
    },
    ...(CommonConfig.isChatSetting && CommonConfig.isChatSave
      ? [
          {
            icon: <BookmarkIcon fontSize="small" />,
            label: "이력 보관",
            onClick: handleArchive,
          },
        ]
      : []),
    {
      icon: <DeleteIcon fontSize="small" />,
      label: "삭제",
      onClick: handleDelete,
    },
  ];

  const renderListItem = () => {
    if (isEditing) {
      return (
        <TextField
          variant="standard"
          inputRef={inputRef}
          value={editedTitle}
          size="small"
          fullWidth
          InputProps={{
            disableUnderline: true,
          }}
          sx={textFieldStyles}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmitRename();
          }}
        />
      );
    } else {
      return (
        <Link
          href={`/chat/${base64Encode(JSON.stringify(item.id))}`}
          target="_self"
          onClick={() => {
            if (isMobile) {
              setOpen(false);
            }
          }}
          className="w-[calc(100%-32px)] flex items-center"
          passHref
        >
          <ListItemText
            primary={editedTitle}
            sx={{ maxWidth: 200 }}
            slotProps={{
              primary: {
                sx: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                },
              },
            }}
          />
        </Link>
      );
    }
  };

  return (
    <>
      <StyledListItemButton
        isEditing={isEditing}
        isSelected={selectedId === item.id}
        onClick={() => setSelectedId(Number(item.id))}
      >
        {renderListItem()}

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
        actions={handleActions}
      />
    </>
  );
};

export default ChatHistoryItem;
