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
  margin: "0.25rem 0.75rem",
  padding: "0.4rem 1.5rem",
  borderRadius: "6px",
  border: "1px solid var(--point)",
  color: "#000",
  boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.25)",
  backgroundColor: "#fff",
  "& .MuiListItemIcon-root": {
    justifyContent: "center",
    color: "var(--point)",
  },
  "& .MuiTypography-root": {
    fontWeight: "600",
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
