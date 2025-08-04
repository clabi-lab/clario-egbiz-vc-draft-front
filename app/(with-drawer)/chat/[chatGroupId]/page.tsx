import ChatDetailPageView from "@/components/Chat/ChatDetailPageView";
import { createShareCode, fetchSavedChat } from "@/services/chatService";
import { base64Decode } from "@/utils/encoding";

interface ChatDetailPageProps {
  params: Promise<{ chatGroupId: string }>;
}

const ChatDetailPage = async ({ params }: ChatDetailPageProps) => {
  const { chatGroupId } = await params;

  if (!chatGroupId) {
    throw new Error("Not found");
  }

  const decoded = base64Decode(chatGroupId);
  const groupId = Number(decoded);

  // 서버에서 초기 데이터 fetch
  const shareCodeData = await createShareCode(groupId);
  const chatGroupData = await fetchSavedChat(shareCodeData.encoded_data);

  return (
    <ChatDetailPageView
      initialChatGroupData={chatGroupData}
      groupId={groupId}
    ></ChatDetailPageView>
  );
};

export default ChatDetailPage;
