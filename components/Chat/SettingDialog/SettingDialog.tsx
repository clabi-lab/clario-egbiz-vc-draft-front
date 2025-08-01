import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

import MenuPageView from "./MenuPageView";
import SavedChatTableView from "./SavedChatTableView";
import SatisfactionChatTableView from "./SatisfactionChatTableView";
import ShareChatTableView from "./ShareChatTableView";

import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export enum PageType {
  MENU = "menu",
  SAVE = "save",
  MEMO = "memo",
  SHARE = "share",
}

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingDialog = ({ isOpen, onClose }: ShareDialogProps) => {
  const [pageType, setPageType] = useState<PageType>(PageType.MENU);

  const handleClose = () => {
    setPageType(PageType.MENU);
    onClose();
  };

  const renderPageTitle = () => {
    if (pageType === PageType.MENU) return "설정";

    const titleMap = {
      [PageType.SAVE]: "보관 된 채팅",
      [PageType.MEMO]: "메모 된 채팅",
      [PageType.SHARE]: "공유 된 채팅",
    };

    return (
      <div className="flex items-center gap-1">
        <IconButton onClick={() => setPageType(PageType.MENU)}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        {titleMap[pageType]}
      </div>
    );
  };

  const renderContent = () => {
    switch (pageType) {
      case PageType.MENU:
        return <MenuPageView onClick={setPageType} />;
      case PageType.SAVE:
        return <SavedChatTableView />;
      case PageType.MEMO:
        return <SatisfactionChatTableView />;
      case PageType.SHARE:
        return <ShareChatTableView />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ padding: "16px 24px 0" }}>
        {renderPageTitle()}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ minHeight: "220px" }}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default SettingDialog;
