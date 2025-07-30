"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useFetchSavedChat } from "@/hooks/useChatData";
import { useAlertStore } from "@/store/useAlertStore";

import PastChatsListview from "@/components/Chat/PastChatsListview";

import { ChatListItem } from "@/types/Chat";

const ShareDetailPage = ({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}) => {
  const { shareCode } = use(params);
  const router = useRouter();
  const openAlert = useAlertStore((state) => state.openAlert);

  const { mutateAsync: fetchSavedChat } = useFetchSavedChat();

  const [pastChats, setPastChats] = useState<ChatListItem[]>([]);

  useEffect(() => {
    if (!shareCode) return;

    const init = async () => {
      try {
        const { chats } = await fetchSavedChat({
          encodedData: shareCode,
        });

        setPastChats(
          chats.map((chat) => ({
            chatId: chat.chat_id ?? undefined,
            question: chat.chat_question ?? "",
            streamStages: chat.chat_history_list ?? [],
            streamText: chat.chat_answer ?? "",
            recommendedQuestions: chat.recommended_questions ?? [],
            references: chat.references ?? [],
            selectedItems: chat.select_items
              ? chat.select_items
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
          }))
        );
      } catch (error) {
        openAlert({
          severity: "error",
          message: "잠시 후 다시 시도해주세요",
        });
        router.push("/chat");
      }
    };

    init();
  }, []);

  return (
    <div className="h-full w-full">
      <div className="max-w-[640px] m-auto mt-4 overflow-y-auto p-4">
        {pastChats.length > 0 && <PastChatsListview chatList={pastChats} />}
      </div>
    </div>
  );
};

export default ShareDetailPage;
