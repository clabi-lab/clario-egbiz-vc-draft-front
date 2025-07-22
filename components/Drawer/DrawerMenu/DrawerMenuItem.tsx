"use client";

import React from "react";
import { DrawerItem } from "@/types/Drawer";
import DrawerButtonItem from "./DrawerButtonItem";
import DrawerStandardItem from "./DrawerStandardItem";

interface DrawerMenuItemProps {
  item: DrawerItem;
  isOpen: boolean;
  onClick: (item: DrawerItem) => void;
}

const DrawerMenuItem = ({ item, isOpen, onClick }: DrawerMenuItemProps) => {
  if (item.type === "button") {
    return <DrawerButtonItem item={item} onClick={onClick} />;
  }

  return <DrawerStandardItem item={item} isOpen={isOpen} onClick={onClick} />;
};

export default DrawerMenuItem;
