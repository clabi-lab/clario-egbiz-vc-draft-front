"use client";

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { DrawerItem } from "@/types/Drawer";

interface Props {
  item: DrawerItem;
  onClick: (item: DrawerItem) => void;
}

const DrawerButtonItem = ({ item, onClick }: Props) => {
  const { title, icon: IconComponent } = item;

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => onClick(item)}
        sx={{
          m: "0.5rem 1rem",
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
        }}
      >
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
      </ListItemButton>
    </ListItem>
  );
};

export default DrawerButtonItem;
