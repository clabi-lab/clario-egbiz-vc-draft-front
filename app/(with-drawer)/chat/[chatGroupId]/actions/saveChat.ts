"use server";

import { saveChat } from "@/services/chatService";
import { Chat } from "@/types/Chat";

export async function saveChatAction(chatData: Chat) {
  return await saveChat(chatData);
}
