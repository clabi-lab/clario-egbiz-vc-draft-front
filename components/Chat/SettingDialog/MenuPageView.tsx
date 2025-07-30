import { CommonConfig } from "@/config/common";
import { Button, Divider } from "@mui/material";
import { PageType } from "./SettingDialog";

const MenuPageView = ({ onClick }: { onClick: (value: PageType) => void }) => {
  return (
    <>
      {CommonConfig.isChatSave && (
        <div className="flex items-center justify-between">
          <p>보관 된 채팅</p>
          <Button variant="outlined" onClick={() => onClick(PageType.SAVE)}>
            관리
          </Button>
        </div>
      )}
      <Divider sx={{ my: 2 }} />
      <div className="flex items-center justify-between">
        <p>메모 된 채팅</p>
        <Button variant="outlined" onClick={() => onClick(PageType.MEMO)}>
          관리
        </Button>
      </div>
      <Divider sx={{ my: 2 }} />
      {CommonConfig.isChatSetting && CommonConfig.isChatShare && (
        <div className="flex items-center justify-between">
          <p>공유 된 채팅</p>
          <Button variant="outlined" onClick={() => onClick(PageType.SHARE)}>
            관리
          </Button>
        </div>
      )}
    </>
  );
};

export default MenuPageView;
