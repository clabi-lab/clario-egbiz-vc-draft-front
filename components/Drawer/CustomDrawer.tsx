"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useDrawerStore } from "../../store/useDrawerStore";
import { useChatHistoryStore } from "../../store/useChatHistoryStore";
import { useProjectStore } from "@/store/useProjectStore";
import { drawerConfig, drawerMenuList } from "../../config/drawer.config";
import { getAllChatGroups } from "@/lib/indexedDB";
import { useIsMobile } from "@/hooks/useIsMobile";

import Image from "next/image";
import Link from "next/link";
import { Drawer, IconButton, List } from "@mui/material";
import DrawerButtonItem from "./DrawerMenu/DrawerButtonItem";
import DrawerStandardItem from "./DrawerMenu/DrawerStandardItem";
import { DrawerItem } from "../../types/Drawer";

import MenuIcon from "@mui/icons-material/Menu";

const CustomDrawer = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const isOpen = useDrawerStore((state) => state.isOpen);
  const setOpen = useDrawerStore((state) => state.setOpen);
  const histories = useChatHistoryStore((state) => state.histories);
  const setHistories = useChatHistoryStore((state) => state.setHistories);
  const projectInfo = useProjectStore((state) => state.projectInfo);

  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

  // drawerConfig.activeMenu에 있는 메뉴만 필터링
  const filteredMenuList: DrawerItem[] = drawerConfig.activeMenu
    .map((key) => drawerMenuList.find((item) => item.key === key))
    .filter((item): item is DrawerItem => item !== undefined);

  // 초기화: toggle 메뉴 초기 상태 및 indexedDB 대화 목록 불러오기
  useEffect(() => {
    const initialToggles = drawerMenuList
      .filter((item) => item.type === "toggle")
      .reduce((acc, item) => {
        acc[item.key] = true;
        return acc;
      }, {} as Record<string, boolean>);

    setToggleStates(initialToggles);

    getAllChatGroups().then((list) => {
      setHistories(list);
    });
  }, []);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  // 미리 chat 페이지 prefetch
  useEffect(() => {
    router.prefetch("/chat");
  }, [router]);

  // Drawer 메뉴 항목 클릭 핸들러
  const handleButtonItemClick = (drawerItem: DrawerItem) => {
    if (drawerItem.link) {
      router.push(drawerItem.link);
      if (isMobile) {
        setOpen(false);
      }
      return;
    }
  };

  const handleListItemClick = (drawerItem: DrawerItem) => {
    if (drawerItem.link) {
      router.push(drawerItem.link);
      if (isMobile) {
        setOpen(false);
      }
      return;
    }

    if (drawerItem.type === "toggle") {
      setToggleStates((prev) => ({
        ...prev,
        [drawerItem.key]: !prev[drawerItem.key],
      }));
      return;
    }

    if (drawerItem.key === "style") {
      console.log("스타일 변경 다이얼로그 open");
    }
  };

  return (
    <>
      {/* 상단 좌측 toggle button (Drawer 열기용) */}
      <div className="px-2 pt-1 fixed z-100">
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
          width: drawerConfig.drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerConfig.drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
        {/* Drawer 상단 영역: 메뉴 아이콘 + 로고 */}
        <div className="p-2 bg-drawer-bg text-drawer-text flex items-center">
          <IconButton
            color="inherit"
            onClick={() => {
              setOpen(false);
            }}
          >
            <MenuIcon></MenuIcon>
          </IconButton>
          {drawerConfig.showLogo && projectInfo?.greeting?.light_logo_url && (
            <Link href="/" className="h-[27px] ml-6">
              <Image
                src={projectInfo.greeting.light_logo_url}
                alt="logo"
                width={60}
                height={10}
                className="h-full w-auto"
              />
            </Link>
          )}
        </div>

        {/* Drawer 메뉴 리스트 */}
        <List
          className="bg-drawer-bg text-drawer-text h-[100vh] overflow-auto"
          key="drawerItems"
        >
          {filteredMenuList.map((menu) => {
            const isHistoryEmpty =
              menu.key === "history" && histories.length === 0;
            if (isHistoryEmpty) return null;

            if (menu.type === "button") {
              return (
                <DrawerButtonItem
                  key={menu.key}
                  item={menu}
                  onClick={handleButtonItemClick}
                />
              );
            }

            return (
              <DrawerStandardItem
                key={menu.key}
                item={menu}
                isOpen={toggleStates[menu.key] ?? false}
                onClick={handleListItemClick}
              />
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default CustomDrawer;
