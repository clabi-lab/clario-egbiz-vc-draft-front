import { DrawerItem } from '../types/Drawer';

import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
// import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';

export const drawerWidth = 240;

export const drawerMenuList: DrawerItem[] = [
  {
    id: 1,
    key: 'home',
    title: '홈',
    icon: SearchIcon,
    type: 'menu',
    link: '/',
  },
  {
    id: 2,
    key: 'style',
    title: '스타일 변경',
    icon: TuneIcon,
    type: 'menu',
  },
  {
    id: 3,
    key: 'chat',
    title: '새 대화 시작',
    icon: AddCircleOutlineOutlinedIcon,
    type: 'button',
    link: '/chat',
  },
  {
    id: 3,
    key: 'history',
    title: '최근 질문',
    icon: ExpandMoreOutlinedIcon,
    type: 'toggle',
  },
];
