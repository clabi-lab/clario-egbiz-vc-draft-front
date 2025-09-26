import { apiClient } from "@/services/common/apiClient";

import {
  Chat,
  ChatGroupResponse,
  ChatResponse,
  Memo,
  Satisfaction,
  SavedChats,
} from "@/types/Chat";
import { serverClient } from "./common/serverService";

export const createChatGroup = async (
  title: string,
  ip_address: string
): Promise<ChatGroupResponse> => {
  return apiClient(`/chat`, {
    method: "POST",
    data: { title, ip_address },
  });
};

export const saveChat = async (chatData: Chat): Promise<ChatResponse> => {
  return apiClient(`/chat/${chatData.chat_group_id}`, {
    method: "POST",
    data: chatData,
  });
};

export const updateChat = async (chatData: Chat): Promise<ChatResponse> => {
  return apiClient(`/chat/${chatData.chat_group_id}`, {
    method: "PUT",
    data: chatData,
  });
};

export const createShareCode = async (
  groupId: number
): Promise<{
  encoded_data: string;
}> => {
  return serverClient(`/chat/group/share?groupId=${groupId}`, {
    method: "GET",
  });
};

export const fetchSavedChat = async (
  encodedData: string
): Promise<SavedChats> => {
  return serverClient(`/chat/group/share/${encodedData}`, {
    method: "GET",
  });
};

export const updateSatisfaction = async (
  satisfaction: Satisfaction
): Promise<Satisfaction> => {
  return apiClient(`/chat/satisfaction`, {
    method: "POST",
    data: satisfaction,
  });
};

export const addMemo = async (
  chat_id: number,
  memo_content: string
): Promise<Memo> => {
  return apiClient(`/chat/memo`, {
    method: "POST",
    data: {
      chat_id,
      memo_content,
    },
  });
};

export const updateMemo = async (
  memo_id: number,
  memo_content: string
): Promise<Memo> => {
  return apiClient(`/chat/memo`, {
    method: "PUT",
    data: {
      memo_id,
      memo_content,
    },
  });
};

export const deleteMemo = async (memo_id: number): Promise<void> => {
  return apiClient(`/chat/memo?memo_id=${memo_id}`, {
    method: "DELETE",
  });
};
