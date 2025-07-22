"use client";

import { useRouter } from "next/navigation";

import { base64Encode } from "@/utils/encoding";
import { useFetchSetting } from "@/hooks/useHomeData";
import { createChatGroup } from "@/services/chatService";

import Greeting from "@/components/Common/Greeting";
import SearchBar from "@/components/Common/SearchBar";
import Image from "next/image";
import { homeConfig } from "@/config/home.config";
import FiltersView from "@/components/Common/FiltersView";

const ChatPage = () => {
  const router = useRouter();

  const { data: settingData } = useFetchSetting();

  const handleSearch = async (searchText: string) => {
    try {
      const chatGroup = await createChatGroup(searchText);

      const obj = {
        title: searchText,
        chatGroupId: chatGroup.chat_group_id,
      };
      router.push(`/chat/${base64Encode(JSON.stringify(obj))}`);
    } catch (error) {}
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center md:max-w-[640px] m-auto">
      {settingData.greeting.light_logo_url && (
        <Image
          src={settingData.greeting.light_logo_url || homeConfig.logo}
          width={300}
          height={100}
          alt="logo"
        />
      )}
      <Greeting />
      <FiltersView></FiltersView>
      <SearchBar
        className="mt-8 mx-2 w-full"
        placeholder={settingData.prompt.input}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ChatPage;
