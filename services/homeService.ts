import { baseService } from "./baseService";

export const fetchSetting = async (): Promise<{
  greeting: {
    id: number;
    main_greeting: string;
    light_logo_url: string;
    dark_logo_url: string;
  };
  prompt: {
    id: number;
    input: string;
  };
  example_questions: {
    id: number;
    question: string;
    image_url: string;
  }[];
}> => {
  const response = await baseService.get(`/setting/all`);
  return response.data.data;
};
