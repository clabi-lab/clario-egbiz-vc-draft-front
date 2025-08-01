import SafeHTML from "@/lib/SafeHTML";
import { useProjectStore } from "@/store/useProjectStore";

const Greeting = ({ className }: { className?: string }) => {
  const projectInfo = useProjectStore((state) => state.projectInfo);

  return (
    <SafeHTML
      className={`text-center ${className}`}
      html={
        projectInfo
          ? projectInfo.greeting.main_greeting.replace(/\n/g, "<br />")
          : ""
      }
    />
  );
};

export default Greeting;
