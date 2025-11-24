import { useState } from "react";

import clsx from "clsx";
import { useChatScrollStore } from "@/store/useChatScrollStore";

import {
  Collapse,
  Step,
  StepLabel,
  Stepper,
  styled,
  StepIconProps,
  StepContent,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

import { StreamStage } from "@/types/Stream";

// 상수 정의
const THEME_COLORS = {
  primary: "#005CA4",
  primaryDark: "#004785",
  secondary: "#b0c2d7",
  disabled: "#bbb",
} as const;

const ICON_SIZE = 14;

/**
 * StreamStagesView 컴포넌트의 Props 인터페이스
 */
interface StreamStagesViewProps {
  question: string;
  streamStages: StreamStage[];
  isFinished?: boolean;
  className?: string;
  defaultOpen?: boolean;
}

const StepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  () => ({
    display: "flex",
    alignItems: "center",
    "& .completedIcon": {
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: "50%",
      backgroundColor: "currentColor",
      color: THEME_COLORS.disabled,
    },
    "& .circleIcon": {
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: "50%",
      backgroundColor: "currentColor",
      "&.animate-blink": {
        animation: `blink 2s ease-in-out infinite`,
      },
      "@keyframes blink": {
        "0%": { color: THEME_COLORS.primaryDark },
        "35%": { color: THEME_COLORS.secondary },
        "50%": { color: THEME_COLORS.disabled },
        "65%": { color: THEME_COLORS.secondary },
        "100%": { color: THEME_COLORS.primaryDark },
      },
    },
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          color: THEME_COLORS.primary,
        },
      },
    ],
  })
);

const StreamStagesView = ({
  question,
  streamStages,
  isFinished = false,
  className,
  defaultOpen = true,
}: StreamStagesViewProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const setIsProcessesDropdownOpen = useChatScrollStore(
    (state) => state.setIsProcessesDropdownOpen
  );

  // 현재 활성 단계 계산 (완료되면 모든 단계, 아니면 마지막 단계까지)
  const activeStep = isFinished ? streamStages.length : streamStages.length - 1;

  const handleToggleDropdown = () => {
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);
    setIsProcessesDropdownOpen(newOpenState);
  };

  const renderStepIcon = (props: StepIconProps) => {
    const { active, completed, className } = props;
    const isCompleted = completed || isFinished;
    const shouldAnimate = active && !isCompleted;

    return (
      <StepIconRoot ownerState={{ active }} className={className}>
        {isCompleted ? (
          <Check className="completedIcon" />
        ) : (
          <div
            className={`circleIcon ${shouldAnimate ? "animate-blink" : ""}`}
          />
        )}
      </StepIconRoot>
    );
  };

  return (
    <div className={clsx(className)}>
      <div
        className={`flex items-start justify-between ml-[-3px] cursor-pointer ${
          isOpen ? "mb-2" : ""
        }`}
        onClick={handleToggleDropdown}
      >
        <p className="text-sm">
          {question
            ? `💡 ${question}에 대해 더 자세한 정보를 찾아보겠습니다.`
            : "정보를 찾아보겠습니다."}
        </p>
        {isFinished && (
          <ExpandMoreOutlinedIcon
            sx={{
              transition: `transform 2s ease`,
              transform: isOpen ? "none" : "rotate(180deg)",
              ml: 0.75,
              color: THEME_COLORS.disabled,
            }}
          />
        )}
      </div>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            "& .MuiStepConnector-root": {
              marginLeft: "6px",
              height: "3px",
            },
          }}
        >
          {streamStages.map((stage, index) => (
            <Step key={`streamStage_${index}`} expanded={true}>
              <StepLabel StepIconComponent={renderStepIcon} />
              <StepContent
                sx={{
                  display: "block",
                  fontSize: "13px",
                  marginTop: "-23px",
                  marginLeft: "6px",
                }}
              >
                {stage.text}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Collapse>
    </div>
  );
};
export default StreamStagesView;
