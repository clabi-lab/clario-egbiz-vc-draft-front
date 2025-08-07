import { mergeClassNames } from "@/lib/mergeClassNames";

const AiDisclaimer = ({ className }: { className?: string }) => {
  return (
    <div className={mergeClassNames(className, "text-center text-lg")}>
      인공지능은 방대한 데이터를 기반으로 답변을 생성하나 질문에 따라{" "}
      <span className="text-[#eb1f3d] font-semibold">부정확한 정보가 포함</span>
      될 수 있습니다.
    </div>
  );
};

export default AiDisclaimer;
