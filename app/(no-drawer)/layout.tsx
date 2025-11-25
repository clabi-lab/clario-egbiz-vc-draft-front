const ChatLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export default ChatLayout;
