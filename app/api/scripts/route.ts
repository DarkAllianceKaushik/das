import { NextResponse } from "next/server";
import { getScriptsData } from "@/lib/scripts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getScriptsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/scripts:", error);
    return NextResponse.json(
      { error: "Failed to load scripts" },
      { status: 500 }
    );
  }
}
