"use client";

import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";

interface SafeHTMLProps {
  html: string;
  className?: string;
  ariaLabel?: string;
  role?: string;
}

const SafeHTML = ({ html, className, ariaLabel, role }: SafeHTMLProps) => {
  const safeHtml = useMemo(() => {
    return DOMPurify.sanitize(html, {
      ADD_ATTR: ["aria-label", "aria-describedby", "role", "alt", "title"],
    });
  }, [html]);

  return (
    <div
      className={className || ""}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
      aria-label={ariaLabel}
      role={role}
    />
  );
};

export default SafeHTML;
