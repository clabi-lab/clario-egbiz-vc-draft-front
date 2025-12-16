import type { Metadata, Viewport } from "next";

import { Providers } from "./providers/providers";

import { AuthProvider } from "@/shared/components/AuthProvider";
import { GlobalAlert } from "@/shared/components/GlobalAlert";
import GlobalDialog from "@/shared/components/GlobalDialog";
import ThemeProviderClient from "@/shared/components/ThemeProviderClient";

import "./globals.css";

export const metadata: Metadata = {
  title: "경기기업비서 VC 지원서 AI 작성",
  description: "경기기업비서 VC 지원서 AI 작성",
  keywords: ["경기", "기업비서", "VC", "지원서", "AI", "작성"],
  publisher: "경기기업비서",
  openGraph: {
    title: "경기기업비서 VC 지원서 AI 작성",
    description: "경기기업비서 VC 지원서 AI 작성",
    url: "https://vc-draft.egbiz.clabi.co.kr/",
    siteName: "경기기업비서 VC 지원서 AI 작성",
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
  return (
    <html lang="ko">
      <body>
        <Providers>
          <AuthProvider>
            <ThemeProviderClient>
              <GlobalAlert />
              <GlobalDialog />
              {children}
            </ThemeProviderClient>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
