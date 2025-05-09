"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useDrawerStore } from "../store/useDrawerStore";
import { useChatHistoryStore } from "../store/useChatHistoryStore";
import { drawerWidth, drawerMenuList } from "../config/drawer.config";

import {
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { DrawerItem } from "../types/Drawer";

const PersistentDrawer = () => {
  const router = useRouter();
  const { isOpen, setOpen } = useDrawerStore();

  const [historyListOpen, setHistoryListOpen] = useState(true);

  const { histories } = useChatHistoryStore();

  const renderDrawerItem = (drawerItem: DrawerItem) => {
    if (drawerItem.key === "history" && histories.length === 0) return null;

    const buttonStyle = {
      backgroundColor: "#fff",
      color: "#000",
      margin: "0 1rem",
      borderRadius: "10px",
      ":hover": {
        backgroundColor: "#f5f5f5",
      },
    };

    return (
      <React.Fragment key={drawerItem.key}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleListItemClick(drawerItem)}
            sx={drawerItem.type === "button" ? buttonStyle : {}}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              {drawerItem.icon && <drawerItem.icon />}
            </ListItemIcon>
            <ListItemText primary={drawerItem.title} />
          </ListItemButton>
        </ListItem>

        {drawerItem.key === "history" && renderHistoryList()}
      </React.Fragment>
    );
  };

  const handleListItemClick = (drawerItem: DrawerItem) => {
    if (drawerItem.link) {
      router.push(drawerItem.link);
      return;
    }

    switch (drawerItem.key) {
      case "style":
        console.log("스타일 변경 다이얼로그 open");
        break;
      case "history":
        setHistoryListOpen((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const renderHistoryList = () => {
    return (
      <Collapse in={historyListOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding key="histories">
          {histories.map((history, index) => (
            <ListItemButton
              sx={{ pl: 4, py: "2px" }}
              key={`${history.title}-${index}`}
            >
              <ListItemIcon sx={{ minWidth: "32px" }} />
              <ListItemText
                primary={history.title}
                sx={{
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    );
  };

  return (
    <>
      {/* toggle icon */}
      <div className="px-2 pt-1 fixed">
        <IconButton
          onClick={() => {
            setOpen(true);
          }}
        >
          <MenuIcon></MenuIcon>
        </IconButton>
      </div>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
        {/* toggle icon */}
        <div className="px-2 pt-1 bg-drawer-bg text-drawer-text">
          <IconButton
            color="inherit"
            onClick={() => {
              setOpen(false);
            }}
          >
            <MenuIcon></MenuIcon>
          </IconButton>
        </div>

        {/* Drawer Item*/}
        <List
          className="bg-drawer-bg text-drawer-text h-[100vh] overflow-auto"
          key="drawerItems"
        >
          {drawerMenuList.map((menu) => renderDrawerItem(menu))}
        </List>
      </Drawer>
    </>
  );
};

export default PersistentDrawer;
