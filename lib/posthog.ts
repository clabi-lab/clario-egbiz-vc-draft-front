import posthog from "posthog-js";

export const initPostHog = () => {
  if (typeof window === "undefined") return;

  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: true,
    autocapture: true,
    persistence: "cookie",
    // @ts-expect-error: cookie_domain은 타입 정의에 없음
    cookie_domain: ".clabi.co.kr",
  });
};

export default posthog;
