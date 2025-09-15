import { mergeClassNames } from "@/lib/mergeClassNames";

interface SendIconProps {
  className?: string;
  "aria-label"?: string;
  title?: string;
}

export default function SendIcon({
  className,
  "aria-label": ariaLabel = "전송",
  title = "전송",
}: SendIconProps) {
  return (
    <div className={mergeClassNames(className, "w-[31px] h-[30px]")}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="31"
        height="30"
        viewBox="0 0 31 30"
        fill="none"
        role="img"
        aria-label={ariaLabel}
        title={title}
      >
        <path
          d="M30.3127 13.8874L2.81272 0.137386C2.59718 0.0295943 2.35508 -0.0135955 2.11557 0.0130172C1.87606 0.0396299 1.64934 0.13491 1.46272 0.287386C1.2845 0.436752 1.15148 0.632869 1.07861 0.853691C1.00574 1.07451 0.995907 1.31128 1.05022 1.53739L4.36272 13.7499H18.5002V16.2499H4.36272L1.00022 28.4249C0.949255 28.6137 0.943305 28.8118 0.982852 29.0034C1.0224 29.1949 1.10634 29.3745 1.22792 29.5277C1.3495 29.6809 1.50534 29.8034 1.68289 29.8854C1.86044 29.9674 2.05476 30.0066 2.25022 29.9999C2.4459 29.9987 2.63857 29.9516 2.81272 29.8624L30.3127 16.1124C30.5175 16.0075 30.6893 15.8481 30.8093 15.6518C30.9293 15.4555 30.9928 15.2299 30.9928 14.9999C30.9928 14.7698 30.9293 14.5442 30.8093 14.3479C30.6893 14.1517 30.5175 13.9923 30.3127 13.8874Z"
          fill="url(#paint0_linear_1570_4178)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1570_4178"
            x1="15.9749"
            y1="0.00537109"
            x2="15.9749"
            y2="30.0006"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#CEE2FF" />
            <stop offset="1" stopColor="#005CA4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
