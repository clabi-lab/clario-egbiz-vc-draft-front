import { mergeClassNames } from "@/lib/mergeClassNames";

export default function MicIcon({ className }: { className?: string }) {
  return (
    <div className={mergeClassNames(`${className} w-[54px] h-[54px]`)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="62"
        height="62"
        viewBox="0 0 62 62"
        fill="none"
      >
        <g filter="url(#filter0_d_1030_10221)">
          <circle
            cx="31"
            cy="27"
            r="27"
            fill="url(#paint0_linear_1030_10221)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_1030_10221"
            x="0"
            y="0"
            width="62"
            height="62"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.360784 0 0 0 0 0.980392 0 0 0 0 0.894118 0 0 0 0.1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1030_10221"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1030_10221"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_1030_10221"
            x1="31"
            y1="0"
            x2="31"
            y2="54"
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
