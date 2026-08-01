"use client";

import { useState } from "react";
import type { Script, ScriptInput } from "@/lib/types";
import { Plus, Save, X } from "lucide-react";
import { Button, Card, Checkbox, Input, Label, Select, ListBox, TextArea } from "@heroui/react";

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
      <Card className="border border-alliance-border bg-alliance-card/80">
        <Card.Content className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">
              {editing ? "Edit Script" : "Post New Script"}
            </h3>
            <Button type="button" variant="ghost" size="sm" isIconOnly onPress={onCancel}>
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
                variant="primary"
                fullWidth
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Uses / Description</Label>
              <TextArea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What does this script do?"
                variant="primary"
                fullWidth
                required
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select
                selectedKey={form.category || undefined}
                onSelectionChange={(k) => k !== null && setForm({ ...form, category: String(k) })}
                placeholder="Select category"
                variant="primary"
                fullWidth
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover placement="bottom">
                  <ListBox>
                    {categories.map((c) => (
                      <ListBox.Item key={c} id={c}><Label>{c}</Label></ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
              <div className="mt-2 flex gap-2">
                <Input
                  className="flex-1 text-xs"
                  placeholder="Or type new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  variant="primary"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 px-3"
                  onPress={() => {
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
                selectedKey={form.pricing}
                onSelectionChange={(k) =>
                  k !== null &&
                  setForm({
                    ...form,
                    pricing: String(k) as "free" | "paid",
                  })
                }
                variant="primary"
                fullWidth
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover placement="bottom">
                  <ListBox>
                    <ListBox.Item id="free"><Label>Free</Label></ListBox.Item>
                    <ListBox.Item id="paid"><Label>Paid</Label></ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div>
              <Label>Download URL</Label>
              <Input
                type="url"
                value={form.downloadUrl}
                onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                placeholder="https://pastebin.com/... or Linkvertise URL"
                variant="primary"
                fullWidth
                required
              />
            </div>

            <div>
              <Label>Version</Label>
              <Input
                value={form.version ?? ""}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="e.g. 2.1.0"
                variant="primary"
                fullWidth
              />
            </div>

            <div>
              <Label>Link Type</Label>
              <Select
                selectedKey={form.linkType}
                onSelectionChange={(k) => k !== null && setForm({ ...form, linkType: String(k) as ScriptInput["linkType"] })}
                variant="primary"
                fullWidth
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover placement="bottom">
                  <ListBox>
                    <ListBox.Item id="pastebin"><Label>Pastebin</Label></ListBox.Item>
                    <ListBox.Item id="linkvertise"><Label>Linkvertise</Label></ListBox.Item>
                    <ListBox.Item id="direct"><Label>Direct Link</Label></ListBox.Item>
                    <ListBox.Item id="other"><Label>Other</Label></ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label>Changelog (optional)</Label>
              <TextArea
                value={form.changelog ?? ""}
                onChange={(e) => setForm({ ...form, changelog: e.target.value })}
                placeholder="What changed in this version?"
                variant="primary"
                fullWidth
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="admin, farm, autofarm"
                variant="primary"
                fullWidth
              />
            </div>

            <div className="sm:col-span-2">
              <Checkbox
                isSelected={form.featured ?? false}
                onChange={(selected) => setForm({ ...form, featured: selected })}
              >
                Featured script (shown at top)
              </Checkbox>
            </div>
          </div>

          {error && (
            <p className="text-sm text-rose-400">{error}</p>
          )}

          <div className="flex gap-3">
            <Button type="submit" isDisabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : editing ? "Update Script" : "Post Script"}
            </Button>
            <Button type="button" variant="outline" onPress={onCancel}>
              Cancel
            </Button>
          </div>
        </Card.Content>
      </Card>
    </form>
  );
}
