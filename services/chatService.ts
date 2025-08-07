import { apiClient } from "./apiClient";

import {
  Chat,
  ChatGroupResponse,
  ChatResponse,
  Satisfaction,
  SavedChats,
} from "@/types/Chat";

export const createChatGroup = async (
  title: string,
  ip_address: string
): Promise<ChatGroupResponse> => {
  return apiClient(`/chat/group`, {
    method: "POST",
    data: { title, ip_address },
  });
};

export const saveChat = async (chatData: Chat): Promise<ChatResponse> => {
  return apiClient(`/chat`, {
    method: "POST",
    data: chatData,
  });
};

export const updateChat = async (chatData: Chat): Promise<ChatResponse> => {
  return apiClient(`/chat`, {
    method: "PUT",
    data: chatData,
  });
};

export const createShareCode = async (
  groupId: number
): Promise<{
  encoded_data: string;
}> => {
  return apiClient(`/chat/group/share?groupId=${groupId}`, {
    method: "GET",
  });
};

export const fetchSavedChat = async (
  encodedData: string
): Promise<SavedChats> => {
  return apiClient(`/chat/group/share/${encodedData}`, {
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
