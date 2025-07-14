"use client";

import { useRouter } from "next/navigation";

import { base64Encode } from "@/utils/encoding";
import { useFilterStore } from "@/store/useDrawerStore";
import { useProjectInfoStore } from "@/store/useCommonStore";

import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import Greeting from "@/components/Greeting";
import AiDisclaimer from "@/components/AiDisclaimer";
import { Chip, Stack } from "@mui/material";

import { homeConfig } from "@/config/home.config";

const HomePage = () => {
  const router = useRouter();

  const filterTags = useFilterStore((state) => state.filterTags);
  const greeting = useProjectInfoStore((state) => state.greeting);
  const prompt = useProjectInfoStore((state) => state.prompt);

  const handleSearch = async (searchText: string) => {
    const obj = {
      title: searchText,
    };
    router.push(`/chat/${base64Encode(JSON.stringify(obj))}`);
  };

  return (
    <div className="h-full w-full p-[1rem] flex flex-col items-center">
      <div className="flex-1 overflow-auto flex flex-col items-center justify-center md:min-w-[640px]">
        {greeting.light_logo_url && (
          <Image
            src={greeting.light_logo_url || homeConfig.logo}
            width={300}
            height={100}
            alt="logo"
          />
        )}
        <Greeting className="mt-4" />
        <SearchBar
          className="mt-8 w-full"
          placeholder={prompt.input}
          onSearch={handleSearch}
        />

        <Stack
          spacing={{ xs: 1, sm: 1 }}
          direction="row"
          useFlexGap
          className="mt-4"
          sx={{
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {filterTags.length > 0 &&
            filterTags.map((tag, index) => (
              <Chip
                label={tag}
                key={`${tag}_${index}`}
                sx={{
                  backgroundColor: "var(--tag-bg)",
                  color: "var(--tag-text)",
                  borderRadius: "8px",
                  px: 0.75,
                  py: 0.5,
                  height: "auto",
                  "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "normal",
                  },
                }}
              />
            ))}
        </Stack>
      </div>
      <AiDisclaimer className="mt-2" />
    </div>
  );
};

export default HomePage;
