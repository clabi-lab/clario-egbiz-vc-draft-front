"use client";

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { DrawerItem } from "@/types/Drawer";

interface Props {
  item: DrawerItem;
  isOpen: boolean;
  onClick: (item: DrawerItem) => void;
}

const DrawerStandardItem = ({ item, isOpen, onClick }: Props) => {
  const { title, icon: IconComponent, type, subList } = item;
  const isToggle = type === "toggle";

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => onClick(item)}
          sx={{
            "&:hover": {
              backgroundColor: "var(--drawer-hover-bg)",
              color: "var(--drawer-hover-text)",
            },
          }}
        >
          <ListItemText primary={title} />
          {IconComponent && (
            <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
              <IconComponent
                sx={{
                  transition: "transform 0.3s ease",
                  transform: isToggle && !isOpen ? "rotate(180deg)" : "none",
                }}
              />
            </ListItemIcon>
          )}
        </ListItemButton>
      </ListItem>

      {isToggle && subList && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          {subList}
        </Collapse>
      )}
    </>
  );
};

export default DrawerStandardItem;
