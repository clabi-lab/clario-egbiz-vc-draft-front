import { NextRequest } from "next/server";
import { createStreamHandler } from "@/lib/apiUtils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { endpoint } = body;

  return createStreamHandler({
    endpoint: `/main/${endpoint}`,
    request,
  });
}
