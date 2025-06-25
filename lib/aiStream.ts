import { StreamEndEvent, StreamEvent } from "@/types/Stream";

export const processAiStream = async (
  stream: ReadableStream<Uint8Array>,
  onEvent: (data: StreamEvent) => void,
  onDone?: (data: StreamEndEvent) => void,
  onError?: (err: Error) => void
) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() || "";

      for (const raw of chunks) {
        const { eventType, eventData, eventId } = parseStreamEvent(raw);

        if (
          (eventType === "ClarioStatus" || eventType === "ClarioResponse") &&
          eventData
        ) {
          const parsed = JSON.parse(eventData);

          if (!parsed) continue;

          const eventPayload: StreamEvent = parsed;

          if (eventPayload.type === "all") {
            onDone?.(eventPayload);
          } else {
            onEvent(eventPayload);
          }
        }

        if (eventType === "ClarioMessageID" && eventId) {
          onEvent({ type: "eventId", eventId, text: "" });
        }
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      onError?.(err);
    } else {
      onError?.(new Error("Unknown stream processing error"));
    }
  }
};

const parseStreamEvent = (raw: string) => {
  const lines = raw.split("\n");
  const result: { eventType?: string; eventData?: string; eventId?: string } =
    {};

  for (const line of lines) {
    if (line.startsWith("event:"))
      result.eventType = line.replace("event: ", "").trim();
    else if (line.startsWith("data:"))
      result.eventData = line.replace("data: ", "").trim();
    else if (line.startsWith("id:"))
      result.eventId = line.replace("id: ", "").trim();
  }

  return result;
};
