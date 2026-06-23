"use client";

import { useState } from "react";
import { MessageCircle, Save } from "lucide-react";

interface DiscordSettingsProps {
  initialUrl: string;
  onSaved: () => void;
}

export function DiscordSettings({ initialUrl, onSaved }: DiscordSettingsProps) {
  const [discordUrl, setDiscordUrl] = useState(initialUrl);
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

  return (
    <section className="card-surface p-6">
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-[#5865F2]" />
        <h2 className="font-display text-lg font-bold">Discord Invite</h2>
      </div>
      <p className="mb-4 text-sm text-glass-muted">
        Set your server invite link. A &quot;Join our Discord&quot; button appears
        on the store when a link is saved. Leave empty to hide it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field" htmlFor="discordUrl">
            Invite URL
          </label>
          <input
            id="discordUrl"
            type="url"
            className="input-field"
            value={discordUrl}
            onChange={(e) => setDiscordUrl(e.target.value)}
            placeholder="https://discord.gg/your-invite"
          />
          <p className="mt-1.5 text-xs text-glass-muted/70">
            Example: https://discord.gg/darkalliance
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && (
          <p className="text-sm text-emerald-400">Discord link saved!</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Discord Link"}
        </button>
      </form>
    </section>
  );
}
