import PersistentDrawer from "@/components/Drawer/CustomDrawer";

const ChatLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <PersistentDrawer></PersistentDrawer>
      {children}
    </>
  );
};

export default ChatLayout;
