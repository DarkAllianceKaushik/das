import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { addCategory, deleteCategory } from "@/lib/scripts";

async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const categories = await addCategory(name);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("POST /api/admin/categories:", error);
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    await deleteCategory(name);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/categories:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
