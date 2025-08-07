export const getDeviceType = (): "mobile" | "desktop" => {
  if (typeof window === "undefined") return "desktop";

  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|blackberry|windows phone/.test(ua);

  return isMobile ? "mobile" : "desktop";
};
