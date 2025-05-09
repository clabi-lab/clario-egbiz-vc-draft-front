import type { Metadata } from "next";

import "./globals.css";
import PersistentDrawer from "@/components/PersistentDrawer";

export const metadata: Metadata = {
  title: "Chat Bot Template",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <body>
        <PersistentDrawer></PersistentDrawer>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
