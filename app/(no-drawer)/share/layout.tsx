import AiDisclaimer from "@/components/Common/AiDisclaimer";

const shareLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="flex flex-col h-full bg-chat-bg">
      <section className="flex-1 overflow-hidden">{children}</section>
      <AiDisclaimer className="m-auto p-2" />
    </main>
  );
};

export default shareLayout;
