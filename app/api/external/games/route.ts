import { NextRequest, NextResponse } from "next/server";
import { searchScriptBloxGames } from "@/lib/external-scripts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ games: [] });
  }

  try {
    const games = await searchScriptBloxGames(q);
    return NextResponse.json({ games });
  } catch (error) {
    console.error("GET /api/external/games:", error);
    return NextResponse.json({ error: "Failed to search games", games: [] }, { status: 500 });
  }
}