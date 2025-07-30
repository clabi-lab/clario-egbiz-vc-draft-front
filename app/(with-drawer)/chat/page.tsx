"use client";

import { useRouter } from "next/navigation";

import { base64Encode } from "@/utils/encoding";
import { useFetchSetting } from "@/hooks/useHomeData";
import { useCreateChatGroup } from "@/hooks/useChatData";

import Greeting from "@/components/Common/Greeting";
import SearchBar from "@/components/Common/SearchBar";
import FiltersView from "@/components/Common/FiltersView";
import Image from "next/image";

const ChatPage = () => {
  const router = useRouter();

  const { data: settingData } = useFetchSetting();
  const { mutateAsync: createGroup } = useCreateChatGroup();

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
      {settingData?.greeting?.light_logo_url && (
        <Image
          src={settingData.greeting.light_logo_url}
          width={300}
          height={100}
          alt="logo"
        />
      )}
      <Greeting className="mt-4" />
      <SearchBar
        className="mt-8 mx-2"
        placeholder={settingData.prompt.input}
        onSearch={handleSearch}
      />
      <FiltersView></FiltersView>
    </div>
  );
};

export default ChatPage;
