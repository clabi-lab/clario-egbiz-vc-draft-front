"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initPostHog } from "@/lib/posthog";
import posthog from "@/lib/posthog";

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      initPostHog();
    }
  }, []);

  useEffect(() => {
    // 페이지 이동 시마다 추적
    posthog.capture("$pageview", {
      pathname,
    });
  }, [pathname]);

  return <>{children}</>;
}
