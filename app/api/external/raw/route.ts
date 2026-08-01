import { NextRequest, NextResponse } from "next/server";
import { fetchExternalRawScript } from "@/lib/external-scripts";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  if (!/^(scriptblox-|rscripts-)[A-Za-z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: "Invalid script ID" }, { status: 400 });
  }

  try {
    const result = await fetchExternalRawScript(id);
    if (!result) {
      return NextResponse.json({ error: "Raw script unavailable" }, { status: 404 });
    }
    return NextResponse.json({ raw: result.content, source: result.source });
  } catch (error) {
    console.error("GET /api/external/raw:", error);
    return NextResponse.json({ error: "Failed to fetch raw script" }, { status: 502 });
  }
}
