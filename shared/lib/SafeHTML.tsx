"use client";

import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";

const SafeHTML = ({
  html,
  className,
}: {
  html: string;
  className?: string;
}) => {
  const safeHtml = useMemo(() => {
    return DOMPurify.sanitize(html);
  }, [html]);

  return (
    <div
      className={className ? className : ""}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

export default SafeHTML;
