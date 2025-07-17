export const fetchStream = async ({
  endpoint,
  body,
  signal,
}: {
  endpoint: string;
  body: Record<string, unknown>;
  signal: AbortSignal;
}): Promise<ReadableStream<Uint8Array>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CLARIO_SERVER}/main/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-cache",
      signal,
    }
  );

  if (!response.ok || !response.body) {
    throw new Error(
      `스트리밍 응답 실패 (${response.status}): ${await response.text()}`
    );
  }

  return response.body;
};
