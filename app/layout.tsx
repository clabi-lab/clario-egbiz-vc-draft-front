import type { Metadata } from "next";

import { Providers } from "./providers";

import PersistentDrawer from "@/components/Drawer/CustomDrawer";
import AppInitializer from "@/components/AppInitializer";
import { GlobalAlert } from "@/components/Common/GlobalAlert";
import PostHogProvider from "@/components/PostHogProvider";

import "./globals.css";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

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
            <ThemeProvider theme={theme}>
              <PersistentDrawer></PersistentDrawer>
              <GlobalAlert />
              <main>{children}</main>
            </ThemeProvider>
          </PostHogProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
