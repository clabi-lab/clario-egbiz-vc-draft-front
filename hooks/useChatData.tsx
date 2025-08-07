import { useMutation } from "@tanstack/react-query";

import { createChatGroup } from "@/services/chatService";

import { queryClient } from "@/lib/queryClient";

// POST 요청 결과를 캐싱하기 위해 React Query 사용
export const useCreateChatGroup = () => {
  return useMutation({
    mutationFn: ({ title, ipAddress }: { title: string; ipAddress: string }) =>
      createChatGroup(title, ipAddress),
    onSuccess: (data) => {
      const key = ["chatGroup", data.chat_group_id];

      queryClient.setQueryData(key, data);

      queryClient.setQueryDefaults(key, {
        gcTime: 500,
      });
    },
  });
};
