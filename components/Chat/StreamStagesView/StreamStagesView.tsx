import { useState } from "react";

import clsx from "clsx";
import { useChatScrollStore } from "@/store/useChatScrollStore";

import {
  Collapse,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  styled,
  stepConnectorClasses,
  StepIconProps,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

import { StreamStage } from "@/types/Stream";

import "./StreamStagesView.css";

interface StreamStagesViewProps {
  question: string;
  streamStages: StreamStage[];
  isFinished?: boolean;
  className?: string;
  defaultOpen?: boolean;
}

const Connector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    padding: 0,
    backgroundColor: "#000",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#bbbbbb",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#bbbbbb",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#bbbbbb",
    borderRadius: 0.5,
    margin: "-5px 0 -5px -3px",
  },
}));

const StepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  () => ({
    display: "flex",
    alignItems: "center",
    "& .completedIcon": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
      color: "#bbbbbb",
    },
    "& .circleIcon": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          color: "var(--point)",
        },
      },
    ],
  })
);

const StreamStagesView = ({
  question,
  streamStages,
  isFinished,
  className,
  defaultOpen = true,
}: StreamStagesViewProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const setIsProcessesDropdownOpen = useChatScrollStore(
    (state) => state.setIsProcessesDropdownOpen
  );

  const activeStep = isFinished ? streamStages.length : streamStages.length - 1;

  const handleDropdownOpen = () => {
    setIsOpen(!isOpen);
    setIsProcessesDropdownOpen(!isOpen);
  };

  const StepIcon = (props: StepIconProps) => {
    const { active, completed, className } = props;

    return (
      <StepIconRoot ownerState={{ active }} className={className}>
        {completed || isFinished ? (
          <Check className="completedIcon" />
        ) : (
          <div className={`circleIcon ${active ? "animate-pulse" : ""}`} />
        )}
      </StepIconRoot>
    );
  };

  return (
    <div className={clsx(className)}>
      {question && (
        <div
          className={`flex items-start justify-between ml-[-3px] cursor-pointer  ${
            isOpen ? "mb-2" : ""
          }`}
          onClick={() => handleDropdownOpen()}
        >
          <p className="text-chat-sm">
            💡 {question}에 대해 더 자세한 정보를 찾아보겠습니다.
          </p>
          {isFinished && (
            <ExpandMoreOutlinedIcon
              sx={{
                ml: 2,
                color: "#bbbbbb",
                transition: "transform 0.3s ease",
                transform: isOpen ? "rotate(180deg)" : "none",
              }}
            />
          )}
        </div>
      )}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          connector={<Connector />}
        >
          {streamStages.map((stage, index) => {
            return (
              <Step key={`streamStage_${index}`}>
                <StepLabel StepIconComponent={StepIcon}>{stage.text}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Collapse>
    </div>
  );
};

export default StreamStagesView;
