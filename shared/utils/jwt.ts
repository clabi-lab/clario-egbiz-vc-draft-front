/**
 * Base64 디코딩 (UTF-8 한글 지원)
 */
export const decodeBase64UTF8 = (str: string): string => {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
};

/**
 * JWT 토큰 파싱
 */
export const parseJWT = <T = any>(token: string): T | null => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(decodeBase64UTF8(payload));
  } catch {
    return null;
  }
};
