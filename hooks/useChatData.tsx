import { useMutation } from "@tanstack/react-query";

import { createChatGroup, fetchSavedChat } from "@/services/chatService";

import { queryClient } from "@/lib/queryClient";

export const useCreateChatGroup = () => {
  return useMutation({
    mutationFn: ({ title }: { title: string }) => createChatGroup(title),
    onSuccess: (data) => {
      const key = ["chatGroup", data.chat_group_id];

      queryClient.setQueryData(key, data);

      queryClient.setQueryDefaults(key, {
        gcTime: 1000 * 60 * 1,
      });
    },
  });
};

export const useFetchSavedChat = () => {
  return useMutation({
    mutationFn: ({ encodedData }: { encodedData: string }) =>
      fetchSavedChat(encodedData),
  });
};
