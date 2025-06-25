import { HttpResponse, http } from "msw";
import { savedChat, streamEvents } from "./data";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER;

export const handlers = [
  /** ───────────────────────────────────────
   * 기본 라우트 처리
   * ─────────────────────────────────────── */

  // favicon 요청 처리
  http.get("/favicon.ico", () => {
    return new HttpResponse("ok");
  }),

  /** ───────────────────────────────────────
   * 홈 페이지 관련
   * ─────────────────────────────────────── */

  // 초기 인사 메시지
  http.get(`${API_BASE_URL}/greeting`, () => {
    return HttpResponse.json([
      {
        id: -1,
        mainGreeting: "CLARIO는 아래와 같은 내용에 대한 질의응답이 가능합니다.",
      },
    ]);
  }),

  // 프롬프트 입력 안내 메시지
  http.get(`${API_BASE_URL}/prompt-input`, () => {
    return HttpResponse.json([
      {
        id: -1,
        input: "질의하실 내용을 입력해 주세요.",
      },
    ]);
  }),

  /** ───────────────────────────────────────
   * 챗 페이지 관련
   * ─────────────────────────────────────── */

  // 새로운 채팅 그룹 생성
  http.post(`${API_BASE_URL}/chat/group`, () => {
    return HttpResponse.json({
      chat_group_id: -1,
      title: "안녕",
      chats: [],
      created_at: "2025-06-02T09:01:20.215Z",
      updated_at: "2025-06-02T09:01:20.215Z",
    });
  }),

  // AI 응답 스트리밍 (SSE 방식)
  http.post(`${API_BASE_URL}/main`, () => {
    const stream = new ReadableStream({
      async start(controller) {
        for (const event of streamEvents) {
          controller.enqueue(new TextEncoder().encode(`${event}\n\n`));
          await new Promise((r) => setTimeout(r, 200)); // 이벤트 간 200ms 지연 (선택 사항)
        }
        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        connection: "keep-alive",
      },
    });
  }),

  // 공유된 채팅 데이터 조회
  http.get(`${API_BASE_URL}/chat/group/share/:encodedData`, () => {
    return HttpResponse.json({
      chat_group_id: -1,
      title: "안녕",
      chats: [savedChat],
      created_at: "2025-06-02T09:01:20.215Z",
      updated_at: "2025-06-02T09:01:20.215Z",
    });
  }),
];
