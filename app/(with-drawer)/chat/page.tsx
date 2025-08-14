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
  const ip = useProjectStore((state) => state.ip);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollable = useScrollCheck(containerRef);

  const handleSearch = async (searchText: string) => {
    try {
      const chatGroup = await createGroup({ title: searchText, ipAddress: ip });

      router.push(
        `/chat/${base64Encode(JSON.stringify(chatGroup.chat_group_id))}`
      );
    } catch (error) {}
  };

  return (
    <div
      ref={containerRef}
      className={mergeClassNames(
        "h-full w-full flex flex-col items-center justify-center m-auto px-4 mt-8 md:mt-0",
        isScrollable ? "justify-start" : "justify-center"
      )}
    >
      {projectInfo && (
        <>
          {projectInfo?.greeting?.light_logo_url && (
            <Image
              src={projectInfo.greeting.light_logo_url}
              width={250}
              height={190}
              alt="logo"
              style={{ width: 250, height: 190 }}
              priority
            />
          )}
          <Greeting className="mt-4" />
          <SearchBar
            className="mt-4 mx-2 min-h-[65px] max-w-[800px]"
            placeholder={projectInfo.prompt.input}
            onSearch={handleSearch}
          />
          <ExampleQuestions
            className="mt-4 max-w-[900px]"
            onSearch={handleSearch}
          />
          <FiltersView className="max-w-[800px]"></FiltersView>
        </>
      )}
    </div>
  );
};

export default ChatPage;
