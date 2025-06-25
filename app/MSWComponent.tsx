"use client";

import { useEffect } from "react";

export const MSWComponent = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const startMock = async () => {
      const { initMockAPI } = await import("../mocks/init");
      await initMockAPI();
    };

    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
    ) {
      startMock();
    }
  }, []);

  return <>{children}</>;
};
