import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  styled,
} from "@mui/material";
import { DrawerItem } from "@/types/Drawer";

interface DrawerStandardItemProps {
  item: DrawerItem;
  isOpen: boolean;
  onClick: (item: DrawerItem) => void;
}

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "isText",
})<{ isText: boolean }>(({ isText }) => ({
  "&:hover": isText
    ? {
        backgroundColor: "transparent",
      }
    : {
        backgroundColor: "var(--drawer-hover-bg)",
        color: "var(--drawer-hover-text)",
      },
}));

const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== "isRotated",
})<{ isRotated: boolean }>(({ isRotated }) => ({
  color: "inherit",
  minWidth: 32,
  "& svg": {
    transition: "transform 0.3s ease",
    transform: isRotated ? "rotate(180deg)" : "none",
  },
}));

const DrawerStandardItem = ({
  item,
  isOpen,
  onClick,
}: DrawerStandardItemProps) => {
  const { title, icon: IconComponent, type, subList } = item;
  const isToggle = type === "toggle";
  const isText = type === "text";

  return (
    <>
      <ListItem disablePadding>
        <StyledListItemButton
          disableRipple={isText}
          isText={isText}
          onClick={() => onClick(item)}
        >
          <ListItemText
            primary={title}
            slotProps={{
              primary: {
                sx: {
                  fontWeight: "bold",
                },
              },
            }}
          />
          {IconComponent && (
            <StyledListItemIcon isRotated={isToggle && !isOpen}>
              <IconComponent />
            </StyledListItemIcon>
          )}
        </StyledListItemButton>
      </ListItem>

      {subList &&
        (isToggle ? (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            {subList}
          </Collapse>
        ) : (
          <>{subList}</>
        ))}
    </>
  );
};

export default DrawerStandardItem;
