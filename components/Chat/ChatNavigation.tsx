"use client";

import { useState } from "react";

import { mergeClassNames } from "@/lib/mergeClassNames";
import { CommonConfig } from "@/config/common";

import { Button, IconButton } from "@mui/material";
import ShareDialog from "./ShareDialog";
import SettingDialog from "./SettingDialog/SettingDialog";

import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";

interface ChatNavigationProps {
  className?: string;
  isChatHistories: boolean;
}

const ChatNavigation = ({
  className,
  isChatHistories,
}: ChatNavigationProps) => {
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [settingDialogOpen, setSettingDialogOpen] = useState<boolean>(false);

  return (
    <div
      className={mergeClassNames(
        className,
        "flex justify-end items-center my-1 mx-2 min-h-[40px]"
      )}
    >
      {CommonConfig.isChatShare && isChatHistories && (
        <>
          <Button
            color="basic"
            variant="outlined"
            size="small"
            sx={{
              height: "30px",
            }}
            onClick={() => setShareDialogOpen(true)}
          >
            <ShareIcon
              sx={{
                fontSize: "18px",
                marginRight: "4px",
              }}
            />
            공유
          </Button>

          <ShareDialog
            isOpen={shareDialogOpen}
            onClose={() => setShareDialogOpen(false)}
          />
        </>
      )}

      {CommonConfig.isChatSetting && (
        <>
          <IconButton onClick={() => setSettingDialogOpen(true)}>
            <SettingsIcon />
          </IconButton>

          <SettingDialog
            isOpen={settingDialogOpen}
            onClose={() => setSettingDialogOpen(false)}
          ></SettingDialog>
        </>
      )}
    </div>
  );
};

export default ChatNavigation;
