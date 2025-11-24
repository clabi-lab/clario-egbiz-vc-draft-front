import Link from "next/link";

import { base64Encode } from "@/utils/encoding";
import { useDrawerStore } from "@/store/useDrawerStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useChatHistoryStore } from "@/store/useChatHistoryStore";

import { ListItemButton, ListItemText, styled } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { MoreHoriz as MoreIcon } from "@mui/icons-material";

import type { ChatHistoryItem } from "@/types/Chat";
import { useRouter } from "next/navigation";

const CONSTANTS = {
  MAX_TITLE_WIDTH: 200,
} as const;

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "isMenuOpen",
})<{ isMenuOpen: boolean }>(({ isMenuOpen, theme, selected }) => ({
  paddingLeft: theme.spacing(4),
  paddingTop: "2px",
  paddingBottom: "2px",
  "&:hover .more-icon": {
    display: "inline-flex",
  },
  ...(isMenuOpen && {
    "& .more-icon": {
      display: "inline-flex",
    },
  }),
  "&:hover": {
    backgroundColor: "var(--drawer-hover-bg-secondary)",
    color: "var(--drawer-hover-text)",
  },
  "&.Mui-selected": {
    backgroundColor: "var(--drawer-hover-bg)",
    color: "var(--drawer-hover-text)",
    "&:hover": {
      backgroundColor: "var(--drawer-hover-bg)",
      color: "var(--drawer-hover-text)",
    },
  },
}));

interface ButtonItemProps {
  item: ChatHistoryItem;
  editedTitle: string;
  isMenuOpen: boolean;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const ButtonItem = ({
  item,
  editedTitle,
  isMenuOpen,
  onMenuClick,
}: ButtonItemProps) => {
  const setDrawerOpen = useDrawerStore((state) => state.setOpen);
  const isMobile = useIsMobile();
  const selectedId = useChatHistoryStore((state) => state.selectedId);
  const encodedId = base64Encode(JSON.stringify(item.id));
  const router = useRouter();

  const handleLinkClick = () => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleClick = () => {
    // 이동 직후 서버 데이터 새로고침
    setTimeout(() => {
      router.refresh();
    }, 0);
  };

  return (
    <StyledListItemButton
      disableRipple
      isMenuOpen={isMenuOpen}
      onClick={handleLinkClick}
      selected={selectedId === item.id}
    >
      <Link
        href={`/chat/${encodedId}`}
        onClick={handleClick}
        target="_self"
        className={`w-[calc(100%-32px)] flex items-center`}
        passHref
      >
        <ListItemText
          primary={editedTitle}
          sx={{ maxWidth: CONSTANTS.MAX_TITLE_WIDTH }}
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

      <ListItemIcon
        className="more-icon ml-2"
        sx={{
          minWidth: 24,
          display: "none",
          cursor: "pointer",
        }}
        onClick={onMenuClick}
      >
        <MoreIcon sx={{ color: "white" }} />
      </ListItemIcon>
    </StyledListItemButton>
  );
};

export default ButtonItem;
