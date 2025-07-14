"use client";

import { useEffect } from "react";

import { useFetchSetting } from "@/hooks/useHomeData";
import { useProjectInfoStore } from "@/store/useCommonStore";

import HomePage from "./home/page";

import { saveIp } from "@/services/commonService";

const App = () => {
  const { data: settingData } = useFetchSetting();

  useEffect(() => {
    saveIp();
  }, []);

  useEffect(() => {
    if (settingData) {
      useProjectInfoStore.getState().setInfo(settingData);
    }
  }, [settingData]);

  return <HomePage />;
};

export default App;
