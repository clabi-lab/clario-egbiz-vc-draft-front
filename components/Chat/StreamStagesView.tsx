import React from "react";
import clsx from "clsx";
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  CircularProgress,
  StepIconProps,
} from "@mui/material";

import { StreamEvent } from "@/types/Stream";
import "./StreamStagesView.css";

// 로딩 아이콘 컴포넌트
const LoadingStepIcon = ({ active, completed }: StepIconProps) => {
  return active && !completed ? (
    <CircularProgress size={14} thickness={5} />
  ) : (
    <span className="MuiStepIcon-root MuiStepIcon-completed" />
  );
};

type StreamStagesViewProps = {
  streamStages: StreamEvent[];
  isFinished?: boolean;
  className?: string;
};

const StreamStagesView = ({
  streamStages,
  isFinished,
  className,
}: StreamStagesViewProps) => {
  const hasStages = streamStages.length > 0;
  const activeStep = isFinished ? streamStages.length : streamStages.length - 1;

  return (
    <div className={clsx(className)}>
      {hasStages && (
        <Box className="bg-white rounded-lg p-2" sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {streamStages.map((stage, index) => {
              const isLast = index === streamStages.length - 1;
              const isCompleted = isFinished || index < activeStep;
              const showLoaderIcon = !isFinished && isLast;

              return (
                <Step key={`streamStage_${index}`} completed={isCompleted}>
                  <StepLabel
                    slots={{
                      stepIcon: showLoaderIcon ? LoadingStepIcon : undefined,
                    }}
                    sx={{ color: "text-gray-500" }}
                  >
                    {stage.text}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      )}
    </div>
  );
};

export default StreamStagesView;
