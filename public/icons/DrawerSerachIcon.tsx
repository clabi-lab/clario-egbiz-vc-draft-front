import { mergeClassNames } from "@/lib/mergeClassNames";

interface DrawerSerachIconProps {
  className?: string;
  "aria-label"?: string;
  title?: string;
}

export default function DrawerSerachIcon({
  className,
  "aria-label": ariaLabel = "검색",
  title = "검색",
}: DrawerSerachIconProps) {
  return (
    <div className={mergeClassNames(`${className} w-[20px] h-[20px]`)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        role="img"
        aria-label={ariaLabel}
        title={title}
      >
        <path
          d="M8.33268 3.33332C5.57126 3.33332 3.33268 5.5719 3.33268 8.33332C3.33268 11.0947 5.57126 13.3333 8.33268 13.3333C11.0941 13.3333 13.3327 11.0947 13.3327 8.33332C13.3327 5.5719 11.0941 3.33332 8.33268 3.33332ZM1.66602 8.33332C1.66602 4.65142 4.65078 1.66666 8.33268 1.66666C12.0146 1.66666 14.9993 4.65142 14.9993 8.33332C14.9993 9.87392 14.4768 11.2925 13.5992 12.4214L18.0886 16.9107C18.414 17.2362 18.414 17.7638 18.0886 18.0892C17.7632 18.4147 17.2355 18.4147 16.9101 18.0892L12.4207 13.5999C11.2918 14.4774 9.87327 15 8.33268 15C4.65078 15 1.66602 12.0152 1.66602 8.33332Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
