"use client";

import { useEffect } from "react";

import { useProjectStore } from "@/store/useProjectStore";

import { ProjectInfo } from "@/types/Common";
import { saveIp } from "@/services/commonService";
import { getDeviceType } from "@/utils/device";

const AppInitializer = ({ projectinfo }: { projectinfo: ProjectInfo }) => {
  const setProjectInfo = useProjectStore((state) => state.setProjectInfo);
  const setIp = useProjectStore((state) => state.setIp);

  useEffect(() => {
    const sendIp = async () => {
      const deviceType = getDeviceType();
      const data = await saveIp(deviceType);
      setIp(data.ip_address);
    };

    sendIp();
  }, []);

  useEffect(() => {
    setProjectInfo(projectinfo);
  }, [projectinfo]);

  return null;
};

export default AppInitializer;
