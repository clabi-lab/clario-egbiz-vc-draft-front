import clsx from "clsx";

import { Button, IconButton } from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import ShareDialog from "./ShareDialog";
import { useState } from "react";
import { CommonConfig } from "@/config/common";
import SettingDialog from "./SettingDialog/SettingDialog";

interface ChatNavigationProps {
  className?: string;
}

const ChatNavigation = ({ className }: ChatNavigationProps) => {
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [settingDialogOpen, setSettingDialogOpen] = useState<boolean>(false);

  return (
    <div
      className={clsx(
        className,
        "flex justify-end items-center mt-3 mb-1 mx-2"
      )}
    >
      {CommonConfig.isChatShare && (
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
