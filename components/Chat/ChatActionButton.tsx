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
    <div className="absolute top-[-50px] left-[50%] translate-x-[-50%]">
      {isStreaming && (
        <IconButton onClick={onClickStop}>
          <StopCircleOutlinedIcon
            fontSize="large"
            sx={{
              backgroundColor: "var(--chat-bg)",
              borderRadius: "50%",
            }}
          />
        </IconButton>
      )}

      {!isStreaming && showScrollButton && (
        <IconButton onClick={onClickScroll}>
          <ArrowCircleDownIcon
            fontSize="large"
            sx={{
              backgroundColor: "var(--chat-bg)",
              borderRadius: "50%",
              transition: "transform 0.3s ease",
              transform: isUserScrolling ? "none" : "rotate(180deg)",
            }}
          />
        </IconButton>
      )}
    </div>
  );
};

export default ChatActionButton;
