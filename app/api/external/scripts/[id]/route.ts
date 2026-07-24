import { NextRequest, NextResponse } from "next/server";
import { fetchExternalScriptById } from "@/lib/external-scripts";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing script ID" }, { status: 400 });
  }

  const script = await fetchExternalScriptById(id);
  if (!script) {
    return NextResponse.json({ error: "Script not found" }, { status: 404 });
  }

  return NextResponse.json({ script });
}
