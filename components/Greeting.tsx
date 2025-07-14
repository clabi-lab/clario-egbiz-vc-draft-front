import React from "react";
import { useProjectInfoStore } from "@/store/useCommonStore";

const Greeting = ({ className }: { className?: string }) => {
  const greeting = useProjectInfoStore((state) => state.greeting);

  return (
    <div
      className={`text-cente ${className}`}
      dangerouslySetInnerHTML={{ __html: greeting.main_greeting }}
    />
  );
};

export default Greeting;
