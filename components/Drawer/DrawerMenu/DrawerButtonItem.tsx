"use client";

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { DrawerItem } from "@/types/Drawer";

interface DrawerButtonItemProps {
  item: DrawerItem;
  onClick: (item: DrawerItem) => void;
}

const StyledDrawerButton = styled(ListItemButton)(() => ({
  margin: "0.5rem 1rem",
  borderRadius: "10px",
  border: "1px solid var(--point)",
  color: "var(--point)",
  fontWeight: "bold",

  "& .MuiListItemIcon-root": {
    justifyContent: "center",
    color: "var(--point)",
  },

  "&:hover": {
    backgroundColor: "var(--drawer-hover-bg)",
    color: "var(--drawer-hover-text)",
  },

  "&:hover .MuiListItemIcon-root": {
    color: "var(--drawer-hover-text)",
  },
}));

const DrawerButtonItem = ({ item, onClick }: DrawerButtonItemProps) => {
  const { title, icon: IconComponent } = item;

  return (
    <ListItem disablePadding>
      <StyledDrawerButton onClick={() => onClick(item)}>
        {IconComponent && (
          <ListItemIcon
            sx={{
              color: "inherit",
            }}
          >
            <IconComponent />
          </ListItemIcon>
        )}
        <ListItemText primary={title} />
      </StyledDrawerButton>
    </ListItem>
  );
};

export default DrawerButtonItem;
