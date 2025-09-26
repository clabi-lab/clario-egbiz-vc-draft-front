import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER;

// 메모 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}/chat/memo`, {
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
    console.error("Add memo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 메모 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}/chat/memo`, {
      method: "PUT",
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
    console.error("Update memo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 메모 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memo_id = searchParams.get("memo_id");

    const response = await fetch(`${BASE_URL}/chat/memo?memo_id=${memo_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
    console.error("Delete memo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
