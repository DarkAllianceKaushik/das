"use client";

import { useCallback, useEffect, useState } from "react";
import type { Script } from "@/lib/types";
import { ScriptForm } from "./ScriptForm";
import { DiscordSettings } from "./DiscordSettings";
import {
  Github,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AdminDashboard() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [githubWrite, setGithubWrite] = useState(false);
  const [githubRepo, setGithubRepo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Script | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");

  const loadData = useCallback(async () => {
    const [scriptsRes, meRes] = await Promise.all([
      fetch("/api/admin/scripts"),
      fetch("/api/auth/me"),
    ]);

    if (scriptsRes.ok) {
      const data = await scriptsRes.json();
      setScripts(data.scripts || []);
      setCategories(data.categories || []);
      setDiscordUrl(data.settings?.discordUrl || "");
    }

    if (meRes.ok) {
      const me = await meRes.json();
      setGithubWrite(me.githubConfigured);
      setGithubRepo(me.githubRepoConfigured ?? me.githubConfigured);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This will commit to GitHub if configured.`)) {
      return;
    }

    const res = await fetch(`/api/admin/scripts?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadData();
    } else {
      alert("Delete failed");
    }
  }

  async function handleAddCategory() {
    if (!newCatName.trim()) return;

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName.trim() }),
    });

    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories);
      setNewCatName("");
    }
  }

  function handleFormSaved() {
    setShowForm(false);
    setEditing(null);
    loadData();
  }

  if (loading) {
    return (
      <p className="text-center text-glass-muted">Loading admin panel...</p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-sm text-glass-muted">
            Manage scripts, categories, and your Discord invite link
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!showForm && !editing && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              New Script
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div
        className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
          githubWrite
            ? "border-emerald-900/50 bg-emerald-950/30 text-emerald-300"
            : githubRepo
              ? "border-amber-900/50 bg-amber-950/30 text-amber-300"
              : "border-amber-900/50 bg-amber-950/30 text-amber-300"
        }`}
      >
        <Github className="h-4 w-4 shrink-0" />
        {githubWrite ? (
          <span>
            GitHub connected — script changes auto-commit to your repo.
          </span>
        ) : githubRepo ? (
          <span>
            GitHub token invalid — store can read scripts, but admin saves will
            fail until you fix GITHUB_TOKEN in Vercel (repo scope) and redeploy.
          </span>
        ) : (
          <span>
            GitHub not configured — set GITHUB_REPO and GITHUB_TOKEN in Vercel.
          </span>
        )}
      </div>

      <DiscordSettings
        initialUrl={discordUrl}
        onSaved={loadData}
      />

      {(showForm || editing) && (
        <ScriptForm
          categories={categories}
          editing={editing}
          onSave={handleFormSaved}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c}
                className="rounded-full border border-glass-border bg-glass-darker px-3 py-1 text-sm"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              className="max-w-xs"
              placeholder="New category name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <Button variant="outline" onClick={handleAddCategory}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold">
          All Scripts ({scripts.length})
        </h2>

        {scripts.length === 0 ? (
          <p className="text-glass-muted">No scripts yet. Post your first one!</p>
        ) : (
          <div className="space-y-3">
            {scripts.map((script) => (
              <Card key={script.id} className="card-glass">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{script.name}</h3>
                      <span className="text-xs uppercase text-glass-muted">
                        {script.pricing}
                      </span>
                      <span className="text-xs text-glass-accent/80">
                        {script.category}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-glass-muted">
                      {script.description}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {script.tags.map((t) => (
                        <span key={t} className="text-xs text-glass-muted/70">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      render={<a href={script.downloadUrl} target="_blank" rel="noopener noreferrer" />}
                      variant="outline"
                      size="icon"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditing(script);
                        setShowForm(false);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(script.id, script.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
