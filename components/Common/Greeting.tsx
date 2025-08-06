import { mergeClassNames } from "@/lib/mergeClassNames";
import SafeHTML from "@/lib/SafeHTML";
import { useProjectStore } from "@/store/useProjectStore";

const Greeting = ({ className }: { className?: string }) => {
  const projectInfo = useProjectStore((state) => state.projectInfo);

  if (!projectInfo?.greeting?.main_greeting) return null;

  return (
    <SafeHTML
      className={mergeClassNames(className, "text-center")}
      html={
        projectInfo
          ? projectInfo.greeting.main_greeting.replace(/\n/g, "<br />")
          : ""
      }
    />
  );
};

export default Greeting;
