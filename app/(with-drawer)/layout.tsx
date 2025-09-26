import PersistentDrawer from "@/components/Drawer/CustomDrawer";

const ChatLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <PersistentDrawer></PersistentDrawer>
      <main>{children}</main>
    </>
  );
};

export default ChatLayout;
