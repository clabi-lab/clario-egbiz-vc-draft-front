import { create } from "zustand";

interface Greeting {
  id: number;
  main_greeting: string;
  light_logo_url: string;
  dark_logo_url: string;
}

interface Prompt {
  id: number;
  input: string;
}
interface Question {
  id: number;
  question: string;
  image_url: string;
}

export interface CommonState {
  greeting: Greeting;
  prompt: Prompt;
  example_questions: Question[];
  setInfo: (data: {
    greeting: Greeting;
    prompt: Prompt;
    example_questions: Question[];
  }) => void;
}

export const useProjectInfoStore = create<CommonState>((set) => ({
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
  setInfo: ({ greeting, prompt, example_questions }) =>
    set(() => ({
      greeting,
      prompt,
      example_questions,
    })),
}));
