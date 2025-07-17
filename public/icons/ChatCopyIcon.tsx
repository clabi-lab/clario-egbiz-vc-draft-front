import { mergeClassNames } from "@/lib/mergeClassNames";

export default function ChatCopyIcon({ className }: { className?: string }) {
  return (
    <div className={mergeClassNames(`${className} w-[20px] h-[20px]`)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M16.6665 1.66663H8.33317C7.414 1.66663 6.6665 2.41413 6.6665 3.33329V6.66663H3.33317C2.414 6.66663 1.6665 7.41413 1.6665 8.33329V16.6666C1.6665 17.5858 2.414 18.3333 3.33317 18.3333H11.6665C12.5857 18.3333 13.3332 17.5858 13.3332 16.6666V13.3333H16.6665C17.5857 13.3333 18.3332 12.5858 18.3332 11.6666V3.33329C18.3332 2.41413 17.5857 1.66663 16.6665 1.66663ZM3.33317 16.6666V8.33329H11.6665L11.6682 16.6666H3.33317ZM16.6665 11.6666H13.3332V8.33329C13.3332 7.41413 12.5857 6.66663 11.6665 6.66663H8.33317V3.33329H16.6665V11.6666Z"
          fill="#777777"
        />
      </svg>
    </div>
  );
}
