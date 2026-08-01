import { NextResponse } from "next/server";
import { fetchExternalTrending } from "@/lib/external-scripts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await fetchExternalTrending();
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/external/trending:", error);
    return NextResponse.json(
      { error: "Failed to load trending scripts", scripts: [], sources: { scriptblox: 0, rscripts: 0 } },
      { status: 502 }
    );
  }
}
