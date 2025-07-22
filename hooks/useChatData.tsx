import { useMutation } from "@tanstack/react-query";

import {
  saveChat,
  createChatGroup,
  updateChat,
  createShareCode,
  fetchSavedChat,
} from "@/services/chatService";

import { Chat } from "@/types/Chat";
import { queryClient } from "@/lib/queryClient";

export const useCreateChatGroup = () => {
  return useMutation({
    mutationFn: ({ title }: { title: string }) => createChatGroup(title),
    onSuccess: (data) => {
      const key = ["chatGroup", data.chat_group_id];
      queryClient.setQueryData(key, data);
    },
  });
};

export const useSaveChat = () => {
  return useMutation({
    mutationFn: ({ chatData }: { chatData: Chat }) => saveChat(chatData),
  });
};

export const useUpdateChat = () => {
  return useMutation({
    mutationFn: ({ chatData }: { chatData: Chat }) => updateChat(chatData),
  });
};

export const useCreateShareCode = () => {
  return useMutation({
    mutationFn: ({ groupId }: { groupId: number }) => createShareCode(groupId),
  });
};

export const useFetchSavedChat = () => {
  return useMutation({
    mutationFn: ({ encodedData }: { encodedData: string }) =>
      fetchSavedChat(encodedData),
  });
};
