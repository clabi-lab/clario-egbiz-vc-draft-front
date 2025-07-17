"use client";

import { useEffect } from "react";
import { useFetchSetting } from "@/hooks/useHomeData";
import { saveIp } from "@/services/commonService";

const AppInitializer = () => {
  useFetchSetting();

  useEffect(() => {
    (async () => {
      try {
        await saveIp();
      } catch (e) {
        console.error("IP 저장 실패:", e);
      }
    })();
  }, []);

  return null;
};

export default AppInitializer;
