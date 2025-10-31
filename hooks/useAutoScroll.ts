import { useEffect, useRef, useState } from "react";

/**
 * 스크롤 상태를 추적하고 자동 스크롤을 수행하는 커스텀 훅
 * @param isStreaming - 스트리밍 중인지 여부 (선택적)
 * @param initialScrollToBottom - 초기 렌더링 시 하단으로 스크롤할지 여부 (선택적)
 * @returns ref, isUserScrolling, scrollToBottom, scrollToTop, showScrollButton
 */
export const useAutoScroll = <T extends HTMLElement>(
  isStreaming?: boolean,
  initialScrollToBottom?: boolean
) => {
  const containerRef = useRef<T>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isNearBottom = () => {
    if (!containerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= Math.max(100);
  };

  const isNearTop = () => {
    if (!containerRef.current) return false;
    const { scrollTop, clientHeight } = containerRef.current;
    return scrollTop <= Math.max(50, clientHeight * 0.15);
  };

  const scrollToBottom = (smooth: boolean = true) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "instant",
      });
      setTimeout(() => {
        setIsUserScrolling(false);
      }, 100);
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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(
        () => {
          const nearBottom = isNearBottom();
          const nearTop = isNearTop();

          setIsUserScrolling(!nearBottom);
          setShowScrollButton(!nearTop);
        },
        isStreaming ? 500 : 200
      ); // 스트리밍 중에는 더 긴 타임아웃으로 사용자 의도를 명확하게 감지
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    // 초기 스크롤 위치 설정
    if (initialScrollToBottom) {
      // DOM이 완전히 렌더링된 후 즉시 하단으로 스크롤 (애니메이션 없이)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (el) {
            el.scrollTop = el.scrollHeight;
            setIsUserScrolling(false);
          }
        });
      });
    }

    handleScroll();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [initialScrollToBottom]);

  return {
    containerRef,
    isUserScrolling,
    showScrollButton,
    scrollToTop,
    scrollToBottom,
  };
};
