import type {
  ExternalScript,
  ExternalScriptsResult,
  ExternalSourceFilter,
} from "./external-types";

const SCRIPTBLOX_API = "https://scriptblox.com/api";
const RSCRIPTS_API = "https://rscripts.net/api/v2/scripts";
const DEFAULT_BROWSE_QUERY = "script";
const PER_SOURCE_LIMIT = 12;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${url}`);
  }

  return res.json() as Promise<T>;
}

function truncate(text: string, max = 280): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max)}…`;
}

function scriptBloxImageUrl(image?: string): string | undefined {
  if (!image) return undefined;
  if (image.startsWith("http")) return image;
  return `https://scriptblox.com${image.startsWith("/") ? "" : "/"}${image}`;
}

function mapScriptBlox(raw: Record<string, unknown>): ExternalScript {
  const game = raw.game as { name?: string; imageUrl?: string } | undefined;
  const scriptType = String(raw.scriptType || "free");
  const hasKey = Boolean(raw.key);

  let pricing: ExternalScript["pricing"] = "free";
  if (hasKey) pricing = "key";
  else if (scriptType !== "free") pricing = "paid";

  const slug = String(raw.slug || raw._id || "");

  return {
    id: `scriptblox-${raw._id}`,
    source: "scriptblox",
    name: String(raw.title || "Untitled"),
    description: truncate(
      game?.name
        ? `${game.name}${raw.isUniversal ? " · Universal" : ""}`
        : "Roblox script on ScriptBlox"
    ),
    game: game?.name || "Unknown game",
    views: Number(raw.views) || 0,
    pricing,
    url: `https://scriptblox.com/script/${slug}`,
    imageUrl: scriptBloxImageUrl(
      typeof raw.image === "string"
        ? raw.image
        : typeof game?.imageUrl === "string" && game.imageUrl !== "0"
          ? game.imageUrl
          : undefined
    ),
    verified: Boolean(raw.verified),
    patched: Boolean(raw.isPatched),
    universal: Boolean(raw.isUniversal),
  };
}

function mapRScripts(raw: Record<string, unknown>): ExternalScript {
  const game = raw.game as { title?: string } | undefined;
  const paid = Boolean(raw.paid);
  const keySystem = Boolean(raw.keySystem);

  let pricing: ExternalScript["pricing"] = "free";
  if (keySystem) pricing = "key";
  else if (paid) pricing = "paid";

  const slug = String(raw.slug || raw._id || "");

  return {
    id: `rscripts-${raw._id}`,
    source: "rscripts",
    name: String(raw.title || "Untitled"),
    description: truncate(String(raw.description || "Roblox script on RScripts")),
    game: game?.title || "Unknown game",
    views: Number(raw.views) || 0,
    pricing,
    url: `https://rscripts.net/script/${slug}`,
    imageUrl: typeof raw.image === "string" ? raw.image : undefined,
    verified: false,
    patched: false,
  };
}

function matchesQuery(script: ExternalScript, query: string): boolean {
  const q = query.toLowerCase();
  const haystack = [script.name, script.description, script.game]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

async function fetchScriptBlox(
  query: string,
  page: number,
  isBrowse: boolean
): Promise<{ scripts: ExternalScript[]; totalPages: number }> {
  if (isBrowse && page === 1) {
    const trending = await fetchJson<{
      result?: { scripts?: Record<string, unknown>[] };
    }>(`${SCRIPTBLOX_API}/script/trending`);

    const scripts = (trending.result?.scripts || []).map((s) =>
      mapScriptBlox(s)
    );
    return { scripts: scripts.slice(0, PER_SOURCE_LIMIT), totalPages: 50 };
  }

  const searchQ = isBrowse ? DEFAULT_BROWSE_QUERY : query;
  const searchPage = isBrowse ? page : page;

  const data = await fetchJson<{
    result?: {
      scripts?: Record<string, unknown>[];
      totalPages?: number;
    };
  }>(
    `${SCRIPTBLOX_API}/script/search?q=${encodeURIComponent(searchQ)}&max=${PER_SOURCE_LIMIT}&page=${searchPage}`
  );

  return {
    scripts: (data.result?.scripts || []).map((s) => mapScriptBlox(s)),
    totalPages: data.result?.totalPages || 1,
  };
}

async function fetchRScripts(
  query: string,
  page: number,
  isBrowse: boolean
): Promise<{ scripts: ExternalScript[]; totalPages: number }> {
  const limit = isBrowse ? PER_SOURCE_LIMIT : 30;

  const data = await fetchJson<{
    scripts?: Record<string, unknown>[];
    info?: { maxPages?: number; currentPage?: number };
  }>(`${RSCRIPTS_API}?page=${page}&limit=${limit}&orderBy=date`);

  let scripts = (data.scripts || []).map((s) => mapRScripts(s));

  if (!isBrowse && query) {
    scripts = scripts.filter((s) => matchesQuery(s, query));
    if (scripts.length < 3 && page === 1) {
      const data2 = await fetchJson<{
        scripts?: Record<string, unknown>[];
      }>(`${RSCRIPTS_API}?page=1&limit=60&orderBy=views`);
      scripts = (data2.scripts || [])
        .map((s) => mapRScripts(s))
        .filter((s) => matchesQuery(s, query))
        .slice(0, PER_SOURCE_LIMIT);
    } else {
      scripts = scripts.slice(0, PER_SOURCE_LIMIT);
    }
  }

  return {
    scripts,
    totalPages: data.info?.maxPages || 1,
  };
}

export async function fetchExternalScriptById(
  id: string
): Promise<ExternalScript | null> {
  if (id.startsWith("scriptblox-")) {
    const scriptId = id.slice("scriptblox-".length);
    try {
      const data = await fetchJson<{ script?: Record<string, unknown> }>(
        `${SCRIPTBLOX_API}/script/${encodeURIComponent(scriptId)}`
      );
      if (data?.script) return mapScriptBlox(data.script);
    } catch { return null; }
    return null;
  }

  if (id.startsWith("rscripts-")) {
    const scriptId = id.slice("rscripts-".length);
    try {
      const data = await fetchJson<{ script?: Record<string, unknown> }>(
        `https://rscripts.net/api/v2/script?id=${encodeURIComponent(scriptId)}`
      );
      if (data?.script) return mapRScripts(data.script as Record<string, unknown>);
    } catch { return null; }
    return null;
  }

  return null;
}

export async function fetchExternalScripts(options: {
  query?: string;
  source?: ExternalSourceFilter;
  page?: number;
}): Promise<ExternalScriptsResult> {
  const source = options.source || "all";
  const page = Math.max(1, options.page || 1);
  const query = (options.query || "").trim();
  const isBrowse = query.length === 0;

  const tasks: Promise<{ scripts: ExternalScript[]; totalPages: number }>[] =
    [];

  if (source === "all" || source === "scriptblox") {
    tasks.push(fetchScriptBlox(query, page, isBrowse));
  }
  if (source === "all" || source === "rscripts") {
    tasks.push(fetchRScripts(query, page, isBrowse));
  }

  const results = await Promise.allSettled(tasks);

  let scripts: ExternalScript[] = [];
  let totalPages = 1;

  for (const result of results) {
    if (result.status === "fulfilled") {
      scripts = [...scripts, ...result.value.scripts];
      totalPages = Math.max(totalPages, result.value.totalPages);
    } else {
      console.error("External script source failed:", result.reason);
    }
  }

  scripts.sort((a, b) => b.views - a.views);

  if (source === "all") {
    scripts = scripts.slice(0, PER_SOURCE_LIMIT * 2);
  }

  return {
    scripts,
    page,
    totalPages,
    query,
    source,
  };
}
