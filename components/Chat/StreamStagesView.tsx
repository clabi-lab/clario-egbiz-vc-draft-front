import clsx from "clsx";

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

import { StreamEvent } from "@/types/Stream";

import "./StreamStagesView.css";
import { useState } from "react";

type StreamStagesViewProps = {
  question: string;
  streamStages: StreamEvent[];
  isFinished?: boolean;
  className?: string;
  defaultOpen?: boolean;
};

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
    borderRadius: 1,
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
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-start infinite",
      },
    },
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          color: "#005CA4",
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

  const activeStep = streamStages.length - 1;

  const StepIcon = (props: StepIconProps) => {
    const { active, completed, className } = props;

    return (
      <StepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="completedIcon" />
        ) : (
          <div className="circleIcon" />
        )}
      </StepIconRoot>
    );
  };

  return (
    <div className={clsx(className)}>
      {question && (
        <div
          className={`flex items-center justify-between ml-[-3px] cursor-pointer  ${
            isOpen ? "mb-2" : ""
          }`}
        >
          <p className="text-sm" onClick={() => setIsOpen(!isOpen)}>
            💡 {question}에 대해 더 자세한 정보를 찾아보겠습니다.
          </p>
          {isFinished && (
            <ExpandMoreOutlinedIcon
              sx={{
                transition: "transform 0.3s ease",
                transform: isOpen ? "none" : "rotate(180deg)",
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
