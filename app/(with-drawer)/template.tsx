"use client";

import { useDrawerStore } from "@/store/useDrawerStore";
import { drawerConfig } from "../../config/drawer.config";
import { useIsMobile } from "@/hooks/useIsMobile";

import AiDisclaimer from "@/components/Common/AiDisclaimer";

type TemplateProps = {
  children: React.ReactNode;
};

const Template = ({ children }: TemplateProps) => {
  const setOpen = useDrawerStore((state) => state.setOpen);
  const isDrawerOpen = useDrawerStore((state) => state.isOpen);
  const isMobile = useIsMobile();

  const drawerWidth = !isMobile && isDrawerOpen ? drawerConfig.drawerWidth : 0;

  return (
    <section
      className="h-svh"
      style={{
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: "all 0.225s ease-in-out",
      }}
    >
      <div className="flex flex-col h-full bg-chat-bg relative overflow-hidden">
        {/* 모바일일 때 Drawer가 열려있으면 블러 배경 */}
        {isMobile && isDrawerOpen && (
          <div
            className="absolute inset-0 bg-black opacity-50 z-50"
            onClick={() => setOpen(false)}
          />
        )}

        <section className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </section>
        <AiDisclaimer className="m-auto p-2" />
      </div>
    </section>
  );
};

export default Template;
