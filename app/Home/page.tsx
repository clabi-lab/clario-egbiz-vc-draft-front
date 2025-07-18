"use client";

import { useRouter } from "next/navigation";

import { base64Encode } from "@/utils/encoding";
import { useFetchSetting } from "@/hooks/useHomeData";

import Image from "next/image";
import SearchBar from "@/components/Common/SearchBar";
import Greeting from "@/components/Common/Greeting";
import AiDisclaimer from "@/components/Common/AiDisclaimer";
import FiltersView from "@/components/Common/FiltersView";

import { homeConfig } from "@/config/home.config";

const HomePage = () => {
  const router = useRouter();

  const { data: settingData } = useFetchSetting();

  const handleSearch = (searchText: string) => {
    const obj = {
      title: searchText,
    };
    router.push(`/chat/${base64Encode(JSON.stringify(obj))}`);
  };

  return (
    <div className="h-full w-full p-[1rem] flex flex-col items-center">
      <div className="flex-1 overflow-auto flex flex-col items-center justify-center w-full md:max-w-[640px]">
        {settingData.greeting.light_logo_url && (
          <Image
            src={settingData.greeting.light_logo_url || homeConfig.logo}
            width={300}
            height={100}
            alt="logo"
          />
        )}
        <Greeting className="mt-4" />
        <SearchBar
          className="mt-8 w-full"
          placeholder={settingData.prompt.input}
          onSearch={handleSearch}
        />
        <FiltersView></FiltersView>
      </div>
      <AiDisclaimer className="mt-2" />
    </div>
  );
};

export default HomePage;
