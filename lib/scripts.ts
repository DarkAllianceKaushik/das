import { promises as fs } from "fs";
import path from "path";
import {
  isGitHubRepoConfigured,
  readFileFromGitHub,
  writeFileToGitHub,
} from "./github";
import type {
  Script,
  ScriptInput,
  ScriptsData,
  SiteSettings,
} from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "scripts.json");

const DEFAULT_CATEGORIES = [
  "Admin",
  "Combat",
  "Farming",
  "Visual",
  "Utility",
  "Misc",
];

const DEFAULT_SETTINGS = { discordUrl: "" };

function normalizeData(parsed: Partial<ScriptsData>): ScriptsData {
  const scripts = Array.isArray(parsed.scripts) ? parsed.scripts : [];
  const categories =
    Array.isArray(parsed.categories) && parsed.categories.length > 0
      ? parsed.categories
      : DEFAULT_CATEGORIES;
  const discordUrl =
    typeof parsed.settings?.discordUrl === "string"
      ? parsed.settings.discordUrl.trim()
      : DEFAULT_SETTINGS.discordUrl;

  return {
    scripts,
    categories,
    settings: { discordUrl },
  };
}

async function readLocalFile(): Promise<ScriptsData> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return normalizeData(JSON.parse(raw));
}

async function writeLocalFile(data: ScriptsData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

let githubSha: string | undefined;

async function loadData(): Promise<ScriptsData> {
  if (isGitHubRepoConfigured()) {
    try {
      const file = await readFileFromGitHub();
      if (file) {
        githubSha = file.sha || undefined;
        return normalizeData(JSON.parse(file.content));
      }
      return {
        scripts: [],
        categories: DEFAULT_CATEGORIES,
        settings: DEFAULT_SETTINGS,
      };
    } catch (error) {
      console.error("GitHub read failed:", error);
      return {
        scripts: [],
        categories: DEFAULT_CATEGORIES,
        settings: DEFAULT_SETTINGS,
      };
    }
  }

  return readLocalFile();
}

async function saveData(
  data: ScriptsData,
  commitMessage: string
): Promise<void> {
  const content = JSON.stringify(data, null, 2);

  if (isGitHubRepoConfigured()) {
    await writeFileToGitHub(content, commitMessage, githubSha);
    const refreshed = await readFileFromGitHub();
    if (refreshed) {
      githubSha = refreshed.sha;
    }
    return;
  }

  await writeLocalFile(data);
}

function generateId(): string {
  return `script-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function mergeCategories(data: ScriptsData, category: string): string[] {
  const trimmed = category.trim();
  if (!trimmed) return data.categories;
  if (data.categories.includes(trimmed)) return data.categories;
  return [...data.categories, trimmed].sort();
}

export async function getScriptsData(): Promise<ScriptsData> {
  return loadData();
}

export async function getAllScripts(): Promise<Script[]> {
  const data = await loadData();
  return data.scripts.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function createScript(input: ScriptInput): Promise<Script> {
  const data = await loadData();
  const now = new Date().toISOString();

  const script: Script = {
    id: generateId(),
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category.trim(),
    tags: input.tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
    pricing: input.pricing,
    downloadUrl: input.downloadUrl.trim(),
    linkType: input.linkType,
    featured: input.featured ?? false,
    version: input.version?.trim() || undefined,
    changelog: input.changelog?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  data.scripts.push(script);
  data.categories = mergeCategories(data, script.category);

  await saveData(data, `Add script: ${script.name}`);
  return script;
}

export async function updateScript(
  id: string,
  input: ScriptInput
): Promise<Script | null> {
  const data = await loadData();
  const index = data.scripts.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const existing = data.scripts[index];
  const updated: Script = {
    ...existing,
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category.trim(),
    tags: input.tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
    pricing: input.pricing,
    downloadUrl: input.downloadUrl.trim(),
    linkType: input.linkType,
    featured: input.featured ?? false,
    version: input.version?.trim() || undefined,
    changelog: input.changelog?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  data.scripts[index] = updated;
  data.categories = mergeCategories(data, updated.category);

  await saveData(data, `Update script: ${updated.name}`);
  return updated;
}

export async function deleteScript(id: string): Promise<boolean> {
  const data = await loadData();
  const script = data.scripts.find((s) => s.id === id);
  if (!script) return false;

  data.scripts = data.scripts.filter((s) => s.id !== id);
  await saveData(data, `Delete script: ${script.name}`);
  return true;
}

export async function deleteCategory(name: string): Promise<boolean> {
  const data = await loadData();
  const trimmed = name.trim();
  if (!trimmed) return false;

  data.categories = data.categories.filter(
    (c) => c.toLowerCase() !== trimmed.toLowerCase()
  );

  await saveData(data, `Remove category: ${trimmed}`);
  return true;
}

export async function addCategory(name: string): Promise<string[]> {
  const data = await loadData();
  data.categories = mergeCategories(data, name);
  await saveData(data, `Add category: ${name.trim()}`);
  return data.categories;
}

export async function updateDiscordUrl(url: string): Promise<SiteSettings> {
  const data = await loadData();
  data.settings.discordUrl = url.trim();
  await saveData(data, "Update Discord invite link");
  return data.settings;
}
