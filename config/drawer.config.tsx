import { DrawerItem } from "../types/Drawer";

import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ChatHistories from "@/components/Drawer/ChatHistories/ChatHistories";
import SearchFilter from "@/components/Drawer/SearchFilter/SearchFilter";

// Drawer 전역 설정 값
export const drawerConfig = {
  drawerWidth: 240, // drawer 너비(px)
  showLogo: true, // 로고 표시 여부
  activeMenu: ["chat", "history", "filter"], // 표시할 메뉴 key 값들
};

export const drawerMenuList: DrawerItem[] = [
  {
    key: "home",
    title: "홈",
    icon: SearchIcon,
    type: "menu",
    link: "/",
  },
  {
    key: "style",
    title: "스타일 변경",
    icon: TuneIcon,
    type: "menu",
  },
  {
    key: "chat",
    title: "새 대화 시작",
    icon: AddCircleOutlineOutlinedIcon,
    type: "button",
    link: "/chat",
  },
  {
    key: "history",
    title: "최근 질문",
    icon: ExpandMoreOutlinedIcon,
    type: "toggle", // 토글형 메뉴 (펼침/접힘)
    subList: <ChatHistories />, // 토글 펼침 시 렌더링할 컴포넌트
  },
  {
    key: "filter",
    title: "필터",
    type: "text", // 토글형 메뉴 (펼침/접힘)
    subList: <SearchFilter />, // 토글 펼침 시 렌더링할 컴포넌트
  },
];
