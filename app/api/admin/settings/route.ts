import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteSettings, updateDiscordUrl, updateWebhookUrl } from "@/lib/scripts";
import { discordSettingsSchema } from "@/lib/validation";

export async function GET() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/admin/settings:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if ("webhookUrl" in body) {
      const settings = await updateWebhookUrl(body.webhookUrl || "");
      revalidatePath("/");
      return NextResponse.json({ settings });
    }

    const parsed = discordSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const settings = await updateDiscordUrl(parsed.data.discordUrl);
    revalidatePath("/");
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("PUT /api/admin/settings:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}