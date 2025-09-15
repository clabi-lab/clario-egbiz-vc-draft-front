import { mergeClassNames } from "@/lib/mergeClassNames";

interface MicIconProps {
  className?: string;
  "aria-label"?: string;
  title?: string;
}

export default function MicIcon({
  className,
  "aria-label": ariaLabel = "마이크",
  title = "마이크",
}: MicIconProps) {
  return (
    <div className={mergeClassNames(className, "w-[54px] h-[54px]")}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="62"
        height="62"
        viewBox="0 0 62 62"
        fill="none"
        role="img"
        aria-label={ariaLabel}
        title={title}
      >
        <g filter="url(#filter0_d_1626_12633)">
          <circle
            cx="31"
            cy="27"
            r="27"
            fill="url(#paint0_linear_1626_12633)"
          />
        </g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M31 12C29.4087 12 27.8826 12.6321 26.7574 13.7574C25.6321 14.8826 25 16.4087 25 18V25.5C25 27.0913 25.6321 28.6174 26.7574 29.7426C27.8826 30.8679 29.4087 31.5 31 31.5C32.5913 31.5 34.1174 30.8679 35.2426 29.7426C36.3679 28.6174 37 27.0913 37 25.5V18C37 16.4087 36.3679 14.8826 35.2426 13.7574C34.1174 12.6321 32.5913 12 31 12ZM20.5 24C20.8978 24 21.2794 24.158 21.5607 24.4393C21.842 24.7206 22 25.1022 22 25.5C22 27.8869 22.9482 30.1761 24.636 31.864C26.3239 33.5518 28.6131 34.5 31 34.5C33.3869 34.5 35.6761 33.5518 37.364 31.864C39.0518 30.1761 40 27.8869 40 25.5C40 25.1022 40.158 24.7206 40.4393 24.4393C40.7206 24.158 41.1022 24 41.5 24C41.8978 24 42.2794 24.158 42.5607 24.4393C42.842 24.7206 43 25.1022 43 25.5C43.0003 28.423 41.9337 31.2456 40.0004 33.438C38.0671 35.6303 35.4001 37.0416 32.5 37.407V40.5C32.5 40.8978 32.342 41.2794 32.0607 41.5607C31.7794 41.842 31.3978 42 31 42C30.6022 42 30.2206 41.842 29.9393 41.5607C29.658 41.2794 29.5 40.8978 29.5 40.5V37.407C26.5999 37.0416 23.9329 35.6303 21.9996 33.438C20.0663 31.2456 18.9997 28.423 19 25.5C19 25.1022 19.158 24.7206 19.4393 24.4393C19.7206 24.158 20.1022 24 20.5 24Z"
          fill="white"
        />
        <defs>
          <filter
            id="filter0_d_1626_12633"
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
              result="effect1_dropShadow_1626_12633"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1626_12633"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_1626_12633"
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
