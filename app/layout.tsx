import type { Metadata } from "next";

import { Providers } from "./providers";

import PersistentDrawer from "@/components/Drawer/CustomDrawer";
import AppInitializer from "@/components/AppInitializer";
import { GlobalAlert } from "@/components/Common/GlobalAlert";
import PostHogProvider from "@/components/PostHogProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "KEPIC Alde",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <AppInitializer />
          <PostHogProvider>
            <PersistentDrawer></PersistentDrawer>
            <GlobalAlert />
            <main>{children}</main>
          </PostHogProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
