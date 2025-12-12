import { useRef, useState, useEffect } from "react";

interface UseResizerOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

interface UseResizerReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  leftWidth: number;
  isResizing: boolean;
  handleMouseDown: () => void;
}

const DEFAULT_OPTIONS: Required<UseResizerOptions> = {
  initialWidth: 50,
  minWidth: 20,
  maxWidth: 80,
};

export const useResizer = (
  options: UseResizerOptions = {}
): UseResizerReturn => {
  const { initialWidth, minWidth, maxWidth } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [leftWidth, setLeftWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newLeftWidth));
      setLeftWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, minWidth, maxWidth]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return {
    containerRef,
    leftWidth,
    isResizing,
    handleMouseDown,
  };
};
