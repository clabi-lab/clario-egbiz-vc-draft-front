import React from "react";
import { useFetchSetting } from "@/hooks/useHomeData";

const Greeting = ({ className }: { className?: string }) => {
  const { data: settingData } = useFetchSetting();

  return (
    <div
      className={`text-cente ${className}`}
      dangerouslySetInnerHTML={{ __html: settingData.greeting.main_greeting }}
    />
  );
};

export default Greeting;
