"use client";

import { useState } from "react";
import { MessageCircle, Save, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface DiscordSettingsProps {
  initialUrl: string;
  initialWebhookUrl?: string;
  onSaved: () => void;
}

export function DiscordSettings({ initialUrl, initialWebhookUrl, onSaved }: DiscordSettingsProps) {
  const [discordUrl, setDiscordUrl] = useState(initialUrl);
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        const err = data.error;
        if (typeof err === "object" && err.discordUrl) {
          setError(Array.isArray(err.discordUrl) ? err.discordUrl[0] : "Invalid URL");
        } else {
          setError(typeof err === "string" ? err : "Save failed");
        }
        return;
      }

      setDiscordUrl(data.settings.discordUrl);
      setSuccess(true);
      onSaved();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleWebhookSave() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      });
      if (!res.ok) {
        setError("Failed to save webhook URL");
        return;
      }
      setSuccess(true);
      onSaved();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="card-glass">
      <CardContent className="p-6 space-y-6">
        <div className="mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[#5865F2]" />
          <CardTitle className="font-display text-lg">Discord</CardTitle>
        </div>

        <div>
          <p className="mb-4 text-sm text-glass-muted">
            Set your server invite link. A &quot;Join our Discord&quot; button appears
            on the store when a link is saved. Leave empty to hide it.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="discordUrl">Invite URL</Label>
              <Input
                id="discordUrl"
                type="url"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                placeholder="https://discord.gg/your-invite"
              />
              <p className="mt-1.5 text-xs text-glass-muted/70">
                Example: https://discord.gg/darkalliance
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300 ring-1 ring-red-900/50">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-emerald-950/50 px-3 py-2 text-sm text-emerald-300 ring-1 ring-emerald-900/50">
                Saved!
              </div>
            )}

            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Discord Link"}
            </Button>
          </form>
        </div>

        <div className="border-t border-glass-border/60 pt-6">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#5865F2]" />
            <CardTitle className="font-display text-lg">Webhook Notifications</CardTitle>
          </div>
          <p className="mb-4 text-sm text-glass-muted">
            Get notified in a Discord channel when scripts are created or updated.
            Create a webhook in your server settings &gt; Integrations &gt; Webhooks.
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
              />
            </div>
            <Button type="button" onClick={handleWebhookSave} disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Webhook URL"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}