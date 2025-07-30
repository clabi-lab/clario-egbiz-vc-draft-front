import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface ChatHistoryMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  actions: ActionItem[];
}

const ChatHistoryMenu = ({
  anchorEl,
  open,
  onClose,
  actions,
}: ChatHistoryMenuProps) => (
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
    {actions.map(({ icon, label, onClick }) => (
      <MenuItem
        key={label}
        onClick={() => {
          onClick();
          onClose();
        }}
      >
        <ListItemIcon sx={{ color: "var(--history-menu-text)" }}>
          {icon}
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </MenuItem>
    ))}
  </Menu>
);

export default ChatHistoryMenu;
