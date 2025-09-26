import type { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import AppInitializer from "@/components/AppInitializer";
import { GlobalAlert } from "@/components/Common/GlobalAlert";
import PostHogProvider from "@/components/PostHogProvider";

import { fetchProjectInfo } from "@/services/commonService";

import "./globals.css";
import ThemeProviderClient from "@/components/ThemeProviderClient";

export const metadata: Metadata = {
  title: "KEPIC Alde",
  description: "KEPIC Alde",
  keywords: ["KEPIC", "Alde", "대한전기협회"],
  publisher: "Clabi",
  openGraph: {
    title: "KEPIC Alde",
    description: "KEPIC Alde",
    url: "https://kea.clabi.co.kr/",
    siteName: "KEPIC Alde",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
              {children}
            </ThemeProviderClient>
          </PostHogProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
