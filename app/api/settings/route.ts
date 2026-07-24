import { NextResponse } from "next/server";
import { getScriptsData } from "@/lib/scripts";

export async function GET() {
  try {
    const { settings } = await getScriptsData();
    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ discordUrl: "" });
  }
}
