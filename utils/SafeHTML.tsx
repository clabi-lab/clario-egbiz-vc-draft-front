"use client";

import DOMPurify from "dompurify";
import { useMemo } from "react";

const SafeHTML = ({ html }: { html: string }) => {
  const safeHtml = useMemo(() => {
    return DOMPurify.sanitize(html);
  }, [html]);

  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
};

export default SafeHTML;
