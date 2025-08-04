import type { Metadata } from "next";

import { Providers } from "./providers";

import AppInitializer from "@/components/AppInitializer";
import { GlobalAlert } from "@/components/Common/GlobalAlert";
import PostHogProvider from "@/components/PostHogProvider";

import { fetchProjectInfo, saveIp } from "@/services/commonService";

import { ThemeProvider } from "@mui/material";

import "./globals.css";
import theme from "./theme";

export const metadata: Metadata = {
  title: "KEPIC Alde",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  await saveIp();
  const ProjectInfo = await fetchProjectInfo();

  return (
    <html lang="ko">
      <body>
        <Providers>
          <PostHogProvider>
            <AppInitializer projectinfo={ProjectInfo} />
            <ThemeProvider theme={theme}>
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
