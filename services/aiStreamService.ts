export const fetchAiStream = async (
  query: string,
  groupId: number,
  abortSignal: AbortSignal
): Promise<ReadableStream<Uint8Array>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CLARIO_SERVER}/main`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        query,
        group_id: String(groupId),
        select_action: "",
        form: [],
      }),
      cache: "no-cache",
      signal: abortSignal,
    }
  );

  if (!response.ok || !response.body) {
    throw new Error("스트리밍 응답 실패");
  }

  return response.body;
};
