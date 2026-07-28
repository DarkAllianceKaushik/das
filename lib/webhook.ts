export async function sendDiscordWebhook(
  webhookUrl: string | undefined,
  data: { content?: string; embeds?: Record<string, unknown>[] }
): Promise<void> {
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // silently fail — webhooks are non-critical
  }
}