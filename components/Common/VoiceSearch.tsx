import { useEffect } from "react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import MicIcon from "@/public/icons/MicIcon";

interface VoiceSearchProps {
  onSearch: (transcript: string) => void;
}

const VoiceSearch = ({ onSearch }: VoiceSearchProps) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onSearch(transcript);
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition && listening) {
    return <span>이 브라우저는 음성 인식을 지원하지 않습니다.</span>;
  }

  const handleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: false,
        language: "ko-KR",
      });
    }
  };

  return (
    <button
      onClick={handleListening}
      aria-label="음성 검색"
      className="w-[62px]"
    >
      <MicIcon className={listening ? "animate-pulse" : ""} />
    </button>
  );
};

export default VoiceSearch;
