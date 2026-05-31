"use client";

import { useCallback, useEffect, useState } from "react";
import type { Script } from "@/lib/types";
import { ScriptForm } from "./ScriptForm";
import {
  Github,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";

export function AdminDashboard() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [githubConfigured, setGithubConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Script | null>(null);
  const [newCatName, setNewCatName] = useState("");

  const loadData = useCallback(async () => {
    const [scriptsRes, meRes] = await Promise.all([
      fetch("/api/admin/scripts"),
      fetch("/api/auth/me"),
    ]);

    if (scriptsRes.ok) {
      const data = await scriptsRes.json();
      setScripts(data.scripts || []);
      setCategories(data.categories || []);
    }

    if (meRes.ok) {
      const me = await meRes.json();
      setGithubConfigured(me.githubConfigured);
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
      <p className="text-center text-alliance-muted">Loading admin panel...</p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-sm text-alliance-muted">
            Post, edit, or delete Roblox scripts
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!showForm && !editing && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4" />
              New Script
            </button>
          )}
          <button type="button" onClick={handleLogout} className="btn-secondary">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <div
        className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
          githubConfigured
            ? "border-emerald-900/50 bg-emerald-950/30 text-emerald-300"
            : "border-amber-900/50 bg-amber-950/30 text-amber-300"
        }`}
      >
        <Github className="h-4 w-4 shrink-0" />
        {githubConfigured ? (
          <span>
            GitHub connected — script changes auto-commit to your repo.
          </span>
        ) : (
          <span>
            GitHub not configured — changes save locally in dev only. Set env
            vars on Vercel for production persistence.
          </span>
        )}
      </div>

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

      <section className="card-surface p-6">
        <h2 className="font-display text-lg font-bold">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-alliance-border bg-alliance-darker px-3 py-1 text-sm"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            className="input-field max-w-xs"
            placeholder="New category name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <button type="button" className="btn-secondary" onClick={handleAddCategory}>
            Add
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold">
          All Scripts ({scripts.length})
        </h2>

        {scripts.length === 0 ? (
          <p className="text-alliance-muted">No scripts yet. Post your first one!</p>
        ) : (
          <div className="space-y-3">
            {scripts.map((script) => (
              <div
                key={script.id}
                className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{script.name}</h3>
                    <span className="text-xs uppercase text-alliance-muted">
                      {script.pricing}
                    </span>
                    <span className="text-xs text-alliance-red/80">
                      {script.category}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-alliance-muted">
                    {script.description}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {script.tags.map((t) => (
                      <span key={t} className="text-xs text-alliance-muted/70">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <a
                    href={script.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-3 py-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    className="btn-secondary px-3 py-2"
                    onClick={() => {
                      setEditing(script);
                      setShowForm(false);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="btn-danger px-3 py-2"
                    onClick={() => handleDelete(script.id, script.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
