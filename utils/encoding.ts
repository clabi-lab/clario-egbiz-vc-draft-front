export const base64Encode = (str: string): string => {
  if (typeof window === "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  }

  const utf8Bytes = new TextEncoder().encode(str);
  const binaryStr = Array.from(utf8Bytes)
    .map((b) => String.fromCharCode(b))
    .join("");

  return window.btoa(binaryStr);
};

export const base64Decode = (str: string): string => {
  try {
    if (typeof window === "undefined") {
      return Buffer.from(str, "base64").toString("utf-8");
    }

    const decodedStr = decodeURIComponent(str);

    let sanitized = decodedStr
      .replace(/\s/g, "")
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padding = 4 - (sanitized.length % 4);
    if (padding !== 4) {
      sanitized += "=".repeat(padding);
    }

    const binary = window.atob(sanitized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    const decoded = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("base64 디코딩 실패:", error);
    return "";
  }
};
