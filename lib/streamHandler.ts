import { processAiStream } from "@/lib/aiStream";

import { fetchStream } from "@/services/aiStreamService";

import { StreamEndEvent, StreamEvent } from "@/types/Stream";

export interface StreamArgs {
  endpoint: string;
  question: string;
  chatGroupId: number;
  extraData?: Record<string, unknown>;
  signal: AbortSignal;
  onEvent: (event: StreamEvent) => void;
  onComplete: (event: StreamEndEvent) => void;
  onError: (error: Error) => void;
}

export const handleStream = async ({
  endpoint,
  question,
  chatGroupId,
  extraData = {},
  signal,
  onEvent,
  onComplete,
  onError,
}: StreamArgs) => {
  let body = {
    ...extraData,
  };

  if (endpoint === "c3") {
    body = {
      query: question,
      group_id: String(chatGroupId),
      ...body,
    };
  }

  const stream = await fetchStream({
    endpoint,
    body,
    signal,
  });

  await processAiStream(stream, onEvent, onComplete, onError);
};
