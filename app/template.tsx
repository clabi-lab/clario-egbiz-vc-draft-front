'use client';

import { useDrawerStore } from '../store/useDrawerStore';
import { drawerWidth } from '../config/drawer.config';

const Template = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useDrawerStore();

  return (
    <main
      className="h-[100vh]"
      style={{
        width: `calc(100% - ${isOpen ? drawerWidth : 0}px)`,
        marginLeft: `${isOpen ? drawerWidth : 0}px`,
        transitionDuration: '0.225s',
      }}
    >
      {children}
    </main>
  );
};

export default Template;
