import { useFetchSetting } from "@/hooks/useHomeData";
import SafeHTML from "@/utils/SafeHTML";

const Greeting = ({ className }: { className?: string }) => {
  const { data: settingData } = useFetchSetting();

  return (
    <SafeHTML
      className={`text-center ${className}`}
      html={settingData.greeting.main_greeting.replace(/\n/g, "<br />")}
    />
  );
};

export default Greeting;
