"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog } from "@/lib/posthog";
import posthog from "@/lib/posthog";

function PostHogTracker() {
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

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}

// 메인 PostHogProvider 컴포넌트
export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <PostHogTracker />
      </Suspense>
      {children}
    </>
  );
}
