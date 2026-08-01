"use client";

import { useState } from "react";
import type { Script, ScriptInput } from "@/lib/types";
import { Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
    <form onSubmit={handleSubmit}>
      <Card className="card-glass">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">
              {editing ? "Edit Script" : "Post New Script"}
            </h3>
            <Button type="button" variant="ghost" size="icon-sm" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Script Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Auto Farm Pro"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Uses / Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What does this script do?"
                required
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) => value !== null && setForm({ ...form, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex gap-2">
                <Input
                  className="flex-1 text-xs"
                  placeholder="Or type new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 px-3"
                  onClick={() => {
                    if (newCategory.trim()) {
                      setForm({ ...form, category: newCategory.trim() });
                      setNewCategory("");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Pricing</Label>
              <Select
                value={form.pricing}
                onValueChange={(value) =>
                  value !== null &&
                  setForm({
                    ...form,
                    pricing: value as "free" | "paid",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Download URL</Label>
              <Input
                type="url"
                value={form.downloadUrl}
                onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                placeholder="https://pastebin.com/... or Linkvertise URL"
                required
              />
            </div>

            <div>
              <Label>Version</Label>
              <Input
                value={form.version ?? ""}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="e.g. 2.1.0"
              />
            </div>

            <div>
              <Label>Link Type</Label>
              <Select
                value={form.linkType}
                onValueChange={(value) => value !== null && setForm({ ...form, linkType: value as ScriptInput["linkType"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pastebin">Pastebin</SelectItem>
                  <SelectItem value="linkvertise">Linkvertise</SelectItem>
                  <SelectItem value="direct">Direct Link</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label>Changelog (optional)</Label>
              <Textarea
                value={form.changelog ?? ""}
                onChange={(e) => setForm({ ...form, changelog: e.target.value })}
                placeholder="What changed in this version?"
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Tags (comma separated)</Label>
              <Input
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
                  className="h-4 w-4 rounded border-glass-border bg-glass-darker text-glass-accent focus:ring-glass-accent"
                />
                <span>Featured script (shown at top)</span>
              </label>
            </div>
          </div>

          {error && (
            <p className="text-sm text-rose-400">{error}</p>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : editing ? "Update Script" : "Post Script"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
