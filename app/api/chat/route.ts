import { NextRequest } from "next/server";
import { createApiHandler } from "@/lib/apiUtils";

// 채팅 그룹 생성
export async function POST(request: NextRequest) {
  return createApiHandler({
    endpoint: "/chat/group",
    method: "POST",
    request,
  });
}
