import { NextRequest } from "next/server";
import { createApiHandler } from "@/lib/apiUtils";

// 필터 목록 조회
export async function GET(request: NextRequest) {
  return createApiHandler({
    endpoint: "/chat/filter/tree",
    method: "GET",
    request,
  });
}
