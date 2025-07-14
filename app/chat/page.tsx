"use client";

import { useRouter } from "next/navigation";

import { base64Encode } from "@/utils/encoding";
import { useProjectInfoStore } from "@/store/useCommonStore";

import Greeting from "@/components/Greeting";
import SearchBar from "@/components/SearchBar";

const ChatPage = () => {
  const router = useRouter();

  const prompt = useProjectInfoStore((state) => state.prompt);

  const handleSearch = async (searchText: string) => {
    const obj = {
      title: searchText,
    };
    router.push(`/chat/${base64Encode(JSON.stringify(obj))}`);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <Greeting />
      <SearchBar
        className="mt-8"
        placeholder={prompt.input}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ChatPage;
