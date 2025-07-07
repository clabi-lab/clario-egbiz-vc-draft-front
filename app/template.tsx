"use client";

import { useDrawerStore } from "@/store/useDrawerStore";
import { drawerConfig } from "../config/drawer.config";

//drawer 상태(isOpen)에 따라 레이아웃이 바뀌는 형태라 template로 분리
const Template = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useDrawerStore();

  return (
    <section
      className="h-[100vh]"
      style={{
        width: `calc(100% - ${isOpen ? drawerConfig.drawerWidth : 0}px)`,
        marginLeft: `${isOpen ? drawerConfig.drawerWidth : 0}px`,
        transitionDuration: "0.225s",
      }}
    >
      {children}
    </section>
  );
};

export default Template;
