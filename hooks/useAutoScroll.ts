import { useEffect, useRef, useState } from "react";

/**
 * 스크롤 상태를 추적하고 자동 스크롤을 수행하는 커스텀 훅
 * @returns ref, isUserScrolling, scrollToBottom, scrollToTop, showScrollButton
 */
export const useAutoScroll = <T extends HTMLElement>() => {
  const containerRef = useRef<T>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const isNearBottom = () => {
    if (!containerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= clientHeight * 0.1;
  };

  const isNearTop = () => {
    if (!containerRef.current) return false;
    const { scrollTop, clientHeight } = containerRef.current;
    return scrollTop <= clientHeight * 0.1;
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const nearBottom = isNearBottom();
      const nearTop = isNearTop();

      setIsUserScrolling(!nearBottom);
      setShowScrollButton(!nearTop);
    };

    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    containerRef,
    isUserScrolling,
    showScrollButton,
    scrollToTop,
    scrollToBottom,
  };
};
