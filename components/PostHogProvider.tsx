"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog } from "@/lib/posthog";
import posthog from "@/lib/posthog";

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      initPostHog();
    }
  }, []);

  useEffect(() => {
    // 페이지 이동 시마다 추적
    posthog.capture("$pageview", {
      pathname,
      search: searchParams.toString(),
    });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
