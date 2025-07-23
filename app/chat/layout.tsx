"use client";

import AiDisclaimer from "@/components/Common/AiDisclaimer";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col h-full bg-chat-bg">
      <section className="flex-1 overflow-hidden">{children}</section>
      <AiDisclaimer className="m-auto p-3" />
    </div>
  );
};

export default HomeLayout;
