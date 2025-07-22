import { useEffect, useRef, useState } from "react";

/**
 * 스크롤 상태를 추적하고 자동 스크롤을 수행하는 커스텀 훅
 * @returns ref, isUserScrolling, scrollToBottom 함수
 */
export const useAutoScroll = <T extends HTMLElement>() => {
  const containerRef = useRef<T>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const isNearBottom = () => {
    if (!containerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= clientHeight * 0.1;
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const nearBottom = isNearBottom();
      setIsUserScrolling(!nearBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { containerRef, isUserScrolling, scrollToBottom };
};
