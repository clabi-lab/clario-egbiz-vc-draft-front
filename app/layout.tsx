import type { Metadata } from "next";

import { Providers } from "./providers";

import AppInitializer from "@/components/AppInitializer";
import { GlobalAlert } from "@/components/Common/GlobalAlert";
import PostHogProvider from "@/components/PostHogProvider";

import { fetchProjectInfo } from "@/services/commonService";

import "./globals.css";
import ThemeProviderClient from "@/components/ThemeProviderClient";

export const metadata: Metadata = {
  title: "KEPIC Alde",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const ProjectInfo = await fetchProjectInfo();

  return (
    <html lang="ko">
      <body>
        <Providers>
          <PostHogProvider>
            <AppInitializer projectinfo={ProjectInfo} />
            <ThemeProviderClient>
              <GlobalAlert />
              <main>{children}</main>
            </ThemeProviderClient>
          </PostHogProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
