"use client";

import { useRef } from "react";

import { useRouter } from "next/navigation";

import { base64Encode } from "@/utils/encoding";
import { useProjectStore } from "@/store/useProjectStore";
import { useCreateChatGroup } from "@/hooks/useChatData";
import { mergeClassNames } from "@/lib/mergeClassNames";
import { useScrollCheck } from "@/hooks/useScrollCheck";

import Greeting from "@/components/Common/Greeting";
import SearchBar from "@/components/Common/SearchBar";
import FiltersView from "@/components/Common/FiltersView";
import Image from "next/image";
import ExampleQuestions from "@/components/Chat/ExampleQuestions";

const ChatPage = () => {
  const router = useRouter();

  const { mutateAsync: createGroup } = useCreateChatGroup();
  const projectInfo = useProjectStore((state) => state.projectInfo);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollable = useScrollCheck(containerRef);

  const handleSearch = async (searchText: string) => {
    try {
      const chatGroup = await createGroup({ title: searchText });

      router.push(
        `/chat/${base64Encode(JSON.stringify(chatGroup.chat_group_id))}`
      );
    } catch (error) {}
  };

  return (
    <div
      ref={containerRef}
      className={mergeClassNames(
        "h-full w-full flex flex-col items-center justify-center max-w-[640px] m-auto px-3",
        isScrollable ? "justify-start py-6" : "justify-center"
      )}
    >
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
            className="mt-8 mx-2 min-h-[65px]"
            placeholder={projectInfo.prompt.input}
            onSearch={handleSearch}
          />
          <ExampleQuestions className="mt-4" onSearch={handleSearch} />
          <FiltersView></FiltersView>
        </>
      )}
    </div>
  );
};

export default ChatPage;
