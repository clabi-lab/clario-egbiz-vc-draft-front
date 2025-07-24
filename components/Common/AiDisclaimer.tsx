import { homeConfig } from "@/config/home.config";

const AiDisclaimer = ({ className }: { className?: string }) => {
  return (
    <div
      className={`text-gray-400 text-xs text-center ${className}`}
      dangerouslySetInnerHTML={{ __html: homeConfig.aiDisclaimer }}
    ></div>
  );
};

export default AiDisclaimer;
