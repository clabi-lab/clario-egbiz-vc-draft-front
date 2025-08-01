"use client";

import { useRouter } from "next/navigation";

import { base64Encode } from "@/utils/encoding";
import { useProjectStore } from "@/store/useProjectStore";
import { useCreateChatGroup } from "@/hooks/useChatData";

import Greeting from "@/components/Common/Greeting";
import SearchBar from "@/components/Common/SearchBar";
import FiltersView from "@/components/Common/FiltersView";
import Image from "next/image";

const ChatPage = () => {
  const router = useRouter();

  const { mutateAsync: createGroup } = useCreateChatGroup();
  const projectInfo = useProjectStore((state) => state.projectInfo);

  const handleSearch = async (searchText: string) => {
    try {
      const chatGroup = await createGroup({ title: searchText });

      router.push(
        `/chat/${base64Encode(JSON.stringify(chatGroup.chat_group_id))}`
      );
    } catch (error) {}
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center max-w-[640px] m-auto">
      {projectInfo && (
        <>
          {projectInfo?.greeting?.light_logo_url && (
            <Image
              src={projectInfo.greeting.light_logo_url}
              width={250}
              height={100}
              alt="logo"
            />
          )}
          <Greeting className="mt-4" />
          <SearchBar
            className="mt-8 mx-2"
            placeholder={projectInfo.prompt.input}
            onSearch={handleSearch}
          />
          <FiltersView></FiltersView>
        </>
      )}
    </div>
  );
};

export default ChatPage;
