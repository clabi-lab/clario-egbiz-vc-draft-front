import posthog from "posthog-js";

export const initPostHog = () => {
  if (typeof window === "undefined") return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: true,
    autocapture: true,
    disable_session_recording: true,
  });
};

export default posthog;
