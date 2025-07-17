import { useQuery } from "@tanstack/react-query";
import { fetchSetting } from "@/services/homeService";

export const useFetchSetting = () => {
  return useQuery({
    queryKey: ["setting"],
    queryFn: fetchSetting,
    initialData: {
      greeting: {
        id: 0,
        main_greeting: "",
        light_logo_url: "",
        dark_logo_url: "",
      },
      prompt: {
        id: 0,
        input: "",
      },
      example_questions: [],
    },
  });
};
