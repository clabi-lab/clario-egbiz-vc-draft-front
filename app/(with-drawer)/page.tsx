"use client";

import { useRouter } from "next/navigation";

import { base64Encode } from "@/utils/encoding";
import { useFetchSetting } from "@/hooks/useHomeData";
import { useCreateChatGroup } from "@/hooks/useChatData";

import Image from "next/image";
import SearchBar from "@/components/Common/SearchBar";
import Greeting from "@/components/Common/Greeting";
import FiltersView from "@/components/Common/FiltersView";

const HomePage = () => {
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
    <div className="h-full w-full p-[1rem] flex flex-col items-center">
      <div className="flex-1 overflow-auto flex flex-col items-center justify-center w-full md:max-w-[640px]">
        {settingData && (
          <>
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
              className="mt-8"
              placeholder={settingData.prompt.input}
              onSearch={handleSearch}
            />
            <FiltersView></FiltersView>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
