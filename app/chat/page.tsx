"use client";

import { useRouter } from "next/navigation";

import { base64Encode } from "@/utils/encoding";
import { useFetchSetting } from "@/hooks/useHomeData";

import Greeting from "@/components/Greeting";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { homeConfig } from "@/config/home.config";

const ChatPage = () => {
  const router = useRouter();

  const { data: settingData } = useFetchSetting();

  const handleSearch = (searchText: string) => {
    const obj = {
      title: searchText,
    };
    router.push(`/chat/${base64Encode(JSON.stringify(obj))}`);
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
      <SearchBar
        className="mt-8 mx-2 w-full"
        placeholder={settingData.prompt.input}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ChatPage;
