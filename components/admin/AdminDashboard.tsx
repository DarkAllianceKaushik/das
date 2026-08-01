"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Save, Trash2, Copy } from "lucide-react";
import {
  AlertDialog,
  Button,
  Card,
  Chip,
  ChipLabel,
  Input,
} from "@heroui/react";
import { ScriptForm } from "./ScriptForm";
import { DiscordSettings } from "./DiscordSettings";
import type { Script } from "@/lib/types";

export function AdminDashboard() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Script | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [search, setSearch] = useState("");
  const [copyState, setCopyState] = useState<Record<string, boolean>>({});

  const loadData = useCallback(async () => {
    try {
      const [scriptsRes, settingsRes] = await Promise.all([
        fetch("/api/admin/scripts"),
        fetch("/api/admin/settings"),
      ]);
      if (!scriptsRes.ok) throw new Error("Failed to load scripts");
      const scriptsData = await scriptsRes.json();
      setScripts(scriptsData.scripts);
      setCategories(scriptsData.categories || []);

      const settingsData = await settingsRes.json();
      setDiscordUrl(settingsData.settings?.discordUrl || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreateCategory() {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      setNewCategory("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    }
  }

  async function handleDelete(id: string) {
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/scripts?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete");
      }
      setDeletingId(null);
      await loadData();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleChangePassword() {
    const current = window.prompt("Current password:");
    if (!current) return;
    const next = window.prompt("New password (min 8 chars):");
    if (!next) return;

    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password change failed");
      alert("Password updated");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Password change failed");
    }
  }

  const filtered = search.trim()
    ? scripts.filter((s) =>
        (s.name + " " + (s.category ?? "")).toLowerCase().includes(search.toLowerCase())
      )
    : scripts;

  if (loading) {
    return <p className="text-center text-alliance-muted">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-sm text-alliance-muted">Manage scripts, categories and settings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onPress={handleChangePassword}>
            Change Password
          </Button>
          <Button
            onPress={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New Script
          </Button>
        </div>
      </div>

      {showForm && (
        <ScriptForm
          categories={categories}
          editing={editing}
          onSave={async () => {
            setShowForm(false);
            setEditing(null);
            await loadData();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <DiscordSettings
        initialUrl={discordUrl}
        onSaved={loadData}
      />

      <Card className="border border-alliance-border bg-alliance-card/80">
        <Card.Content className="p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-white">
              Scripts ({scripts.length})
            </h3>
            <Input
              className="max-w-xs"
              placeholder="Search scripts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="primary"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-alliance-border text-xs uppercase tracking-wider text-alliance-muted">
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">Category</th>
                  <th className="pb-2 pr-4 font-medium">Pricing</th>
                  <th className="pb-2 pr-4 font-medium">Featured</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-alliance-border">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-alliance-muted">
                      No scripts found
                    </td>
                  </tr>
                )}
                {filtered.map((script) => (
                  <tr key={script.id} className="transition-colors hover:bg-alliance-card-hover">
                    <td className="py-3 pr-4 font-medium text-white">{script.name}</td>
                    <td className="py-3 pr-4 text-alliance-muted">{script.category ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <Chip color={script.pricing === "free" ? "success" : "accent"} size="sm">
                        <ChipLabel>{script.pricing}</ChipLabel>
                      </Chip>
                    </td>
                    <td className="py-3 pr-4 text-alliance-muted">
                      {script.featured ? "★ Yes" : "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          isIconOnly
                          onPress={() => {
                            setEditing(script);
                            setShowForm(true);
                          }}
                          aria-label={`Edit ${script.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          isIconOnly
                          onPress={() => {
                            navigator.clipboard?.writeText(script.downloadUrl ?? "");
                            setCopyState((prev) => ({ ...prev, [script.id]: true }));
                            setTimeout(
                              () => setCopyState((prev) => ({ ...prev, [script.id]: false })),
                              1500
                            );
                          }}
                          aria-label={`Copy ${script.name} download link`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {copyState[script.id] && (
                          <span className="self-center text-xs text-emerald-400">copied</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          isIconOnly
                          className="text-red-400 hover:!text-red-300"
                          onPress={() => setDeletingId(script.id)}
                          aria-label={`Delete ${script.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>

      <Card className="border border-alliance-border bg-alliance-card/80">
        <Card.Content className="p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Categories</h3>
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Chip key={category} color="accent" variant="soft">
                <ChipLabel>{category}</ChipLabel>
              </Chip>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              variant="primary"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateCategory();
                }
              }}
            />
            <Button variant="outline" onPress={handleCreateCategory}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </Card.Content>
      </Card>

      <AlertDialog.Root isOpen={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialog.Backdrop />
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Heading className="font-display">Delete script?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-sm text-alliance-muted">
                This will permanently remove{" "}
                <span className="font-medium text-white">
                  {scripts.find((s) => s.id === deletingId)?.name}
                </span>{" "}
                from the store. This action cannot be undone.
              </p>
              {deleteError && (
                <p className="mt-3 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300 ring-1 ring-red-900/50">
                  {deleteError}
                </p>
              )}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="outline" onPress={() => setDeletingId(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onPress={() => deletingId && handleDelete(deletingId)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Root>
    </div>
  );
}
