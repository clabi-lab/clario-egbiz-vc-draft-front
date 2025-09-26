import { mergeClassNames } from "@/lib/mergeClassNames";

interface ChatMemoIconProps {
  className?: string;
  "aria-label"?: string;
}

export default function ChatMemoIcon({
  className,
  "aria-label": ariaLabel = "메모",
}: ChatMemoIconProps) {
  return (
    <div className={mergeClassNames(`${className} w-[20px] h-[20px]`)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d="M19.89 13.6011L13.6069 19.8858C13.4442 20.0488 13.2509 20.1781 13.0381 20.2663C12.8253 20.3546 12.5973 20.4 12.367 20.4C12.1366 20.4 11.9086 20.3546 11.6958 20.2663C11.4831 20.1781 11.2898 20.0488 11.127 19.8858L3.59961 12.3652V3.59998H12.3626L19.89 11.1293C20.2164 11.4578 20.3996 11.9021 20.3996 12.3652C20.3996 12.8284 20.2164 13.2727 19.89 13.6011V13.6011Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M7 7H7.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </div>
  );
}
