import { NextRequest, NextResponse } from "next/server";
import { fetchExternalScripts } from "@/lib/external-scripts";
import type { ExternalSourceFilter } from "@/lib/external-types";

const SOURCES: ExternalSourceFilter[] = ["all", "scriptblox", "rscripts"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sourceParam = searchParams.get("source") || "all";
  const game = searchParams.get("game") || "";
  const source = SOURCES.includes(sourceParam as ExternalSourceFilter)
    ? (sourceParam as ExternalSourceFilter)
    : "all";

  try {
    const result = await fetchExternalScripts({
      query: q,
      source,
      page: Number.isNaN(page) ? 1 : page,
      game: game || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/external/scripts:", error);
    return NextResponse.json(
      {
        error: "Failed to load online scripts",
        scripts: [],
        page: 1,
        totalPages: 1,
        query: q,
        source,
      },
      { status: 500 }
    );
  }
}