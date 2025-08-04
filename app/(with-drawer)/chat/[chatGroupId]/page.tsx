import ChatDetailPageView from "@/components/Chat/ChatDetailPageView";
import { createShareCode, fetchSavedChat } from "@/services/chatService";
import { base64Decode } from "@/utils/encoding";

interface ChatDetailPageProps {
  params: Promise<{ chatGroupId: string }>;
}

const ChatDetailPage = async ({ params }: ChatDetailPageProps) => {
  const { chatGroupId } = await params;

  const decoded = base64Decode(chatGroupId);
  if (!decoded) {
    throw new Error("Not found");
  }

  const groupId = Number(decoded);
  if (isNaN(groupId)) {
    throw new Error("Not found");
  }

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
