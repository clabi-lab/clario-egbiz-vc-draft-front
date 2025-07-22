import { baseService } from "./baseService";

import {
  Chat,
  ChatGroupResponse,
  ChatResponse,
  Satisfaction,
} from "@/types/Chat";

export const createChatGroup = async (
  title: string
): Promise<ChatGroupResponse> => {
  const response = await baseService.post(`/chat/group`, { title });
  return response.data;
};

export const saveChat = async (chatData: Chat): Promise<ChatResponse> => {
  const response = await baseService.post(`/chat`, chatData);
  return response.data;
};

export const updateChat = async (chatData: Chat): Promise<ChatResponse> => {
  const response = await baseService.put(`/chat`, chatData);
  return response.data;
};

export const createShareCode = async (
  groupId: number
): Promise<{
  encoded_data: string;
}> => {
  const response = await baseService.get(
    `/chat/group/share?groupId=${groupId}`
  );
  return response.data;
};

export const fetchSavedChat = async (
  encodedData: string
): Promise<{
  chat_group_id: number;
  chats: Chat[];
}> => {
  const response = await baseService.get(`/chat/group/share/${encodedData}`);
  return response.data;
};

export const updateSatisfaction = async (
  satisfaction: Satisfaction
): Promise<Satisfaction> => {
  const response = await baseService.post(`/chat/satisfaction`, satisfaction);
  return response.data;
};
