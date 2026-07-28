import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createScript,
  deleteScript,
  getScriptsData,
  getWebhookUrl,
  updateScript,
} from "@/lib/scripts";
import { scriptInputSchema } from "@/lib/validation";
import { sendDiscordWebhook } from "@/lib/webhook";

async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

async function webhook(event: string, payload: Record<string, unknown>) {
  const url = await getWebhookUrl();
  if (!url) return;
  sendDiscordWebhook(url, {
    embeds: [{
      title: event,
      color: 0xef4444,
      fields: Object.entries(payload).map(([k, v]) => ({
        name: k,
        value: String(v).slice(0, 1024),
        inline: true,
      })),
      timestamp: new Date().toISOString(),
    }],
  });
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await getScriptsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/scripts:", error);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const parsed = scriptInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const script = await createScript(parsed.data);
    revalidatePath("/");
    webhook("Script Created", { Name: script.name, Category: script.category, Pricing: script.pricing });
    return NextResponse.json(script, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/scripts:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Create failed" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const { id, ...rest } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Script id required" }, { status: 400 });
    }

    const parsed = scriptInputSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const script = await updateScript(id, parsed.data);
    if (!script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath(`/scripts/${id}`);
    webhook("Script Updated", { Name: script.name, Category: script.category });
    return NextResponse.json(script);
  } catch (error) {
    console.error("PUT /api/admin/scripts:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Script id required" }, { status: 400 });
    }

    const deleted = await deleteScript(id);
    if (!deleted) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/scripts:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}