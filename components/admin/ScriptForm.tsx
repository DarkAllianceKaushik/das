"use client";

import { useState } from "react";
import type { Script, ScriptInput } from "@/lib/types";
import { Plus, Save, X } from "lucide-react";

const emptyForm: ScriptInput = {
  name: "",
  description: "",
  category: "",
  tags: [],
  pricing: "free",
  downloadUrl: "",
  linkType: "pastebin",
  featured: false,
  version: "",
  changelog: "",
};

interface ScriptFormProps {
  categories: string[];
  editing?: Script | null;
  onSave: () => void;
  onCancel: () => void;
}

export function ScriptForm({
  categories,
  editing,
  onSave,
  onCancel,
}: ScriptFormProps) {
  const [form, setForm] = useState<ScriptInput>(
    editing
      ? {
          name: editing.name,
          description: editing.description,
          category: editing.category,
          tags: editing.tags,
          pricing: editing.pricing,
          downloadUrl: editing.downloadUrl,
          linkType: editing.linkType,
          featured: editing.featured ?? false,
          version: editing.version ?? "",
          changelog: editing.changelog ?? "",
        }
      : emptyForm
  );
  const [tagsInput, setTagsInput] = useState(editing?.tags.join(", ") ?? "");
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload: ScriptInput = {
      ...form,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/scripts", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editing ? { id: editing.id, ...payload } : payload
        ),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Save failed");
        return;
      }

      onSave();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">
          {editing ? "Edit Script" : "Post New Script"}
        </h3>
        <button type="button" onClick={onCancel} className="text-alliance-muted hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label-field">Script Name</label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Auto Farm Pro"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label-field">Uses / Description</label>
          <textarea
            className="input-field min-h-[100px] resize-y"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does this script do?"
            required
          />
        </div>

        <div>
          <label className="label-field">Category</label>
          <select
            className="input-field"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="mt-2 flex gap-2">
            <input
              className="input-field flex-1 text-xs"
              placeholder="Or type new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              type="button"
              className="btn-secondary shrink-0 px-3"
              onClick={() => {
                if (newCategory.trim()) {
                  setForm({ ...form, category: newCategory.trim() });
                  setNewCategory("");
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="label-field">Pricing</label>
          <select
            className="input-field"
            value={form.pricing}
            onChange={(e) =>
              setForm({
                ...form,
                pricing: e.target.value as "free" | "paid",
              })
            }
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div>
          <label className="label-field">Download URL</label>
          <input
            type="url"
            className="input-field"
            value={form.downloadUrl}
            onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
            placeholder="https://pastebin.com/... or Linkvertise URL"
            required
          />
        </div>

        <div>
          <label className="label-field">Version</label>
          <input
            className="input-field"
            value={form.version ?? ""}
            onChange={(e) => setForm({ ...form, version: e.target.value })}
            placeholder="e.g. 2.1.0"
          />
        </div>

        <div>
          <label className="label-field">Link Type</label>
          <select
            className="input-field"
            value={form.linkType}
            onChange={(e) => setForm({ ...form, linkType: e.target.value as ScriptInput["linkType"] })}
          >
            <option value="pastebin">Pastebin</option>
            <option value="linkvertise">Linkvertise</option>
            <option value="direct">Direct Link</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="label-field">Changelog (optional)</label>
          <textarea
            className="input-field min-h-[80px] resize-y"
            value={form.changelog ?? ""}
            onChange={(e) => setForm({ ...form, changelog: e.target.value })}
            placeholder="What changed in this version?"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label-field">Tags (comma separated)</label>
          <input
            className="input-field"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="admin, farm, autofarm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured ?? false}
              onChange={(e) =>
                setForm({ ...form, featured: e.target.checked })
              }
              className="h-4 w-4 rounded border-alliance-border bg-alliance-darker text-alliance-red focus:ring-alliance-red"
            />
            <span>Featured script (shown at top)</span>
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : editing ? "Update Script" : "Post Script"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
