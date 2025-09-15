import { IconButton } from "@mui/material";

import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

type ChatActionButtonProps = {
  isStreaming: boolean;
  isUserScrolling: boolean;
  showScrollButton: boolean;
  onClickStop?: () => void;
  onClickScroll?: () => void;
};

const ChatActionButton = ({
  isStreaming,
  isUserScrolling,
  showScrollButton,
  onClickStop,
  onClickScroll,
}: ChatActionButtonProps) => {
  return (
    <div
      className="absolute top-[-50px] left-[50%] translate-x-[-50%]"
      role="toolbar"
      aria-label="채팅 액션 버튼"
    >
      {isStreaming && (
        <IconButton
          onClick={onClickStop}
          aria-label="스트리밍 중단"
          title="스트리밍 중단"
        >
          <StopCircleOutlinedIcon
            fontSize="large"
            sx={{
              backgroundColor: "var(--chat-bg)",
              borderRadius: "50%",
            }}
            aria-hidden="true"
          />
        </IconButton>
      )}

      {!isStreaming && showScrollButton && (
        <IconButton
          onClick={onClickScroll}
          aria-label={isUserScrolling ? "맨 아래로 스크롤" : "맨 위로 스크롤"}
          title={isUserScrolling ? "맨 아래로 스크롤" : "맨 위로 스크롤"}
        >
          <ArrowCircleDownIcon
            fontSize="large"
            sx={{
              backgroundColor: "var(--chat-bg)",
              borderRadius: "50%",
              transition: "transform 0.3s ease",
              transform: isUserScrolling ? "none" : "rotate(180deg)",
            }}
            aria-hidden="true"
          />
        </IconButton>
      )}
    </div>
  );
};

export default ChatActionButton;
