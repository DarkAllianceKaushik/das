import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://weao.xyz/api/status/exploits", {
      headers: {
        "User-Agent": "WEAO-3PService",
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `WEAO API responded with ${res.status}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch executor data" },
      { status: 502 }
    );
  }
}
