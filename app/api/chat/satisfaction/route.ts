import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER;

// 만족도 평가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}/chat/satisfaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: `API Error: ${response.status}`, details: responseText },
        { status: response.status }
      );
    }

    if (response.status === 204) {
      return NextResponse.json({});
    }

    const parsed = JSON.parse(responseText);
    return NextResponse.json(parsed.data || {});
  } catch (error) {
    console.error("Update satisfaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
