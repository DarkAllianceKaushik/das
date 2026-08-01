import type {
  ExternalScript,
  ExternalScriptsResult,
  ExternalSource,
  ExternalSourceFilter,
  ExternalSort,
  GameSearchResult,
  TrendingResult,
} from "./external-types";

const SCRIPTBLOX_API = "https://scriptblox.com/api";
const RSCRIPTS_API = "https://rscripts.net/api/v2";
const DEFAULT_BROWSE_QUERY = "script";
const PER_SOURCE_LIMIT = 12;

const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 60_000;

function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) return Promise.resolve(cached.data as T);
  return fetcher().then((data) => {
    cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
    return data;
  });
}

async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  attempts = 3,
  delayMs = 700
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetcher();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastError;
}

async function fetchJson<T>(url: string, cacheKey?: string): Promise<T> {
  const doFetch = () =>
    fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      },
      cache: "no-store",
    }).then((res) => {
      if (!res.ok) throw new Error(`Request failed (${res.status}): ${url}`);
      return res.json() as Promise<T>;
    });

  if (cacheKey) return cachedFetch(cacheKey, doFetch);
  return fetchWithRetry(doFetch);
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

const SB_RICH = ["_id","title","views","verified","key","isPatched","isUniversal","slug","image","scriptType","likeCount","dislikeCount","lastBump","script","createdAt"];

function mapScriptBlox(raw: Record<string, unknown>): ExternalScript {
  const game = raw.game as { name?: string; imageUrl?: string; _id?: string } | undefined;
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
    rawScript: typeof raw.script === "string" ? raw.script : undefined,
    likes: typeof raw.likeCount === "number" ? raw.likeCount : undefined,
    dislikes: typeof raw.dislikeCount === "number" ? raw.dislikeCount : undefined,
    gameImageUrl: game?.imageUrl && game.imageUrl !== "0" ? game.imageUrl : undefined,
    gameId: game?._id,
  };
}

function mapRScripts(raw: Record<string, unknown>): ExternalScript {
  const game = raw.game as { title?: string; imgurl?: string; placeId?: string } | undefined;
  const paid = Boolean(raw.paid);
  const keySystem = Boolean(raw.keySystem);
  const user = raw.user as { username?: string; discord?: { username?: string } } | undefined;

  let pricing: ExternalScript["pricing"] = "free";
  if (keySystem) pricing = "key";
  else if (paid) pricing = "paid";

  const slug = String(raw.slug || raw._id || "");
  const tested = Array.isArray(raw.testedExecutors)
    ? (raw.testedExecutors as { title?: string }[]).map((e) => e.title || "").filter(Boolean)
    : undefined;

  return {
    id: `rscripts-${raw._id}`,
    source: "rscripts",
    name: String(raw.title || "Untitled"),
    description: truncate(String(raw.description || "Roblox script on RScripts")),
    game: game?.title || "Unknown game",
    views: Number(raw.views) || 0,
    pricing,
    url: `https://rscripts.net/script/${slug}`,
    imageUrl: typeof raw.image === "string" ? raw.image : game?.imgurl,
    verified: false,
    patched: false,
    rawScript: typeof raw.rawScript === "string" ? raw.rawScript : undefined,
    likes: typeof raw.likes === "number" ? raw.likes : undefined,
    dislikes: typeof raw.dislikes === "number" ? raw.dislikes : undefined,
    mobileReady: Boolean(raw.mobileReady),
    testedExecutors: tested,
    gameImageUrl: game?.imgurl,
    gameId: game?.placeId,
    author: user?.username,
    authorDiscord: user?.discord?.username,
  };
}

async function fetchScriptBlox(
  query: string,
  page: number,
  isBrowse: boolean,
  sort: ExternalSort
): Promise<{ scripts: ExternalScript[]; totalPages: number }> {
  const cacheKey = `sb:${query}:${page}:${isBrowse}:${sort}`;

  if (sort === "trending" && page === 1) {
    const trending = await fetchJson<{
      result?: { scripts?: Record<string, unknown>[] };
    }>(`${SCRIPTBLOX_API}/script/trending`, `${cacheKey}:trending`);

    const scripts = (trending.result?.scripts || []).map((s) => mapScriptBlox(s));
    return { scripts: scripts.slice(0, PER_SOURCE_LIMIT), totalPages: 50 };
  }

  const searchQ = isBrowse ? DEFAULT_BROWSE_QUERY : query;

  const data = await fetchJson<{
    result?: {
      scripts?: Record<string, unknown>[];
      totalPages?: number;
    };
  }>(
    `${SCRIPTBLOX_API}/script/search?q=${encodeURIComponent(searchQ)}&max=${PER_SOURCE_LIMIT}&page=${page}`,
    cacheKey
  );

  let scripts = (data.result?.scripts || []).map((s) => mapScriptBlox(s));
  if (sort === "views") {
    scripts = scripts.sort((a, b) => b.views - a.views);
  }

  return {
    scripts,
    totalPages: data.result?.totalPages || 1,
  };
}

async function fetchRScripts(
  query: string,
  page: number,
  isBrowse: boolean,
  sort: ExternalSort
): Promise<{ scripts: ExternalScript[]; totalPages: number }> {
  const limit = isBrowse ? PER_SOURCE_LIMIT : 30;
  const cacheKey = `rs:${query}:${page}:${isBrowse}:${sort}`;

  if (sort === "trending" && page === 1) {
    const trending = await fetchJson<{
      success?: { views?: number; script?: Record<string, unknown> }[];
    }>(`${RSCRIPTS_API}/trending`, `${cacheKey}:trending`);

    const scripts = (trending.success || [])
      .map((t) => mapRScripts(t.script || {}))
      .filter((s) => s.name !== "Untitled")
      .slice(0, PER_SOURCE_LIMIT);
    return { scripts, totalPages: 50 };
  }

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (!isBrowse && query) params.set("q", query);
  else params.set("orderBy", "date");
  params.set("orderDir", "desc");
  if (sort === "views") params.set("orderBy", "views");
  else if (sort === "newest") params.set("orderBy", "date");

  const data = await fetchJson<{
    scripts?: Record<string, unknown>[];
    info?: { maxPages?: number; currentPage?: number };
  }>(`${RSCRIPTS_API}/scripts?${params.toString()}`, cacheKey);

  let scripts = (data.scripts || []).map((s) => mapRScripts(s));

  if (!isBrowse && query) {
    scripts = scripts.filter((s) => {
      const q = query.toLowerCase();
      return [s.name, s.description, s.game].join(" ").toLowerCase().includes(q);
    });
    if (scripts.length < 3 && page === 1) {
      const fallback = await fetchJson<{
        scripts?: Record<string, unknown>[];
      }>(
        `${RSCRIPTS_API}/scripts?page=1&limit=60&orderBy=views`,
        `rs:fallback:${query}`
      );
      scripts = (fallback.scripts || [])
        .map((s) => mapRScripts(s))
        .filter((s) => {
          const q = query.toLowerCase();
          return [s.name, s.description, s.game].join(" ").toLowerCase().includes(q);
        })
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

export async function fetchScriptBloxByGame(
  gameName: string,
  page = 1
): Promise<{ scripts: ExternalScript[]; totalPages: number }> {
  const cacheKey = `sb:game:${gameName}:${page}`;
  const data = await fetchJson<{
    result?: {
      scripts?: Record<string, unknown>[];
      totalPages?: number;
    };
  }>(
    `${SCRIPTBLOX_API}/script/game/${encodeURIComponent(gameName)}?page=${page}&max=${PER_SOURCE_LIMIT}`,
    cacheKey
  );

  return {
    scripts: (data.result?.scripts || []).map((s) => mapScriptBlox(s)),
    totalPages: data.result?.totalPages || 1,
  };
}

export async function searchScriptBloxGames(
  query: string
): Promise<GameSearchResult[]> {
  const cacheKey = `sb:gamesearch:${query}`;
  const data = await fetchJson<{
    result?: { games?: { _id: string; name: string; imageUrl?: string }[] };
  }>(
    `${SCRIPTBLOX_API}/game/search?q=${encodeURIComponent(query)}`,
    cacheKey
  );

  return (data.result?.games || []).map((g) => ({
    id: g._id,
    name: g.name,
    imageUrl: g.imageUrl && g.imageUrl !== "0" ? g.imageUrl : undefined,
  }));
}

export async function fetchExternalScriptById(
  id: string
): Promise<ExternalScript | null> {
  if (id.startsWith("scriptblox-")) {
    const scriptId = id.slice("scriptblox-".length);
    try {
      const data = await fetchJson<{ script?: Record<string, unknown> }>(
        `${SCRIPTBLOX_API}/script/${encodeURIComponent(scriptId)}`,
        `sb:detail:${scriptId}`
      );
      if (data?.script) return mapScriptBlox(data.script);
    } catch { return null; }
    return null;
  }

  if (id.startsWith("rscripts-")) {
    const scriptId = id.slice("rscripts-".length);
    try {
      const data = await fetchJson<{ script?: Record<string, unknown> }>(
        `${RSCRIPTS_API}/script?id=${encodeURIComponent(scriptId)}`,
        `rs:detail:${scriptId}`
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
  game?: string;
  sort?: ExternalSort;
}): Promise<ExternalScriptsResult> {
  const source = options.source || "all";
  const page = Math.max(1, options.page || 1);
  const query = (options.query || "").trim();
  const sort: ExternalSort = options.sort || (query || options.game ? "views" : "trending");
  const isBrowse = query.length === 0 && !options.game;

  if (options.game && (source === "all" || source === "scriptblox")) {
    const result = await fetchScriptBloxByGame(options.game, page);
    return {
      scripts: result.scripts,
      page,
      totalPages: result.totalPages,
      query: options.game,
      source,
      sort,
    };
  }

  const tasks: Promise<{ scripts: ExternalScript[]; totalPages: number }>[] = [];

  if (source === "all" || source === "scriptblox") {
    tasks.push(fetchScriptBlox(query, page, isBrowse, sort));
  }
  if (source === "all" || source === "rscripts") {
    tasks.push(fetchRScripts(query, page, isBrowse, sort));
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

  if (sort === "views") scripts.sort((a, b) => b.views - a.views);
  else if (sort === "newest") {
    scripts.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      return aName.localeCompare(bName);
    });
  }

  if (source === "all") {
    scripts = scripts.slice(0, PER_SOURCE_LIMIT * 2);
  }

  return {
    scripts,
    page,
    totalPages,
    query,
    source,
    sort,
  };
}

export async function fetchExternalTrending(): Promise<TrendingResult> {
  const results = await Promise.allSettled([
    fetchJson<{ result?: { scripts?: Record<string, unknown>[] } }>(
      `${SCRIPTBLOX_API}/script/trending`,
      "sb:trending"
    ),
    fetchJson<{ success?: { views?: number; script?: Record<string, unknown> }[] }>(
      `${RSCRIPTS_API}/trending`,
      "rs:trending"
    ),
  ]);

  const scripts: ExternalScript[] = [];
  const sources: TrendingResult["sources"] = { scriptblox: 0, rscripts: 0 };

  if (results[0].status === "fulfilled") {
    const sb = (results[0].value.result?.scripts || [])
      .slice(0, PER_SOURCE_LIMIT)
      .map((s) => mapScriptBlox(s));
    scripts.push(...sb);
    sources.scriptblox = sb.length;
  }
  if (results[1].status === "fulfilled") {
    const rs = (results[1].value.success || [])
      .map((t) => mapRScripts((t.script || {}) as Record<string, unknown>))
      .filter((s) => s.name !== "Untitled")
      .slice(0, PER_SOURCE_LIMIT);
    scripts.push(...rs);
    sources.rscripts = rs.length;
  }

  scripts.sort((a, b) => b.views - a.views);
  return { scripts: scripts.slice(0, 12), sources };
}

export async function fetchExternalRawScript(
  id: string
): Promise<{ content: string; source: ExternalSource } | null> {
  if (id.startsWith("scriptblox-")) {
    const scriptId = id.slice("scriptblox-".length);
    const data = await fetchJson<{ script?: Record<string, unknown> }>(
      `${SCRIPTBLOX_API}/script/${encodeURIComponent(scriptId)}`,
      `sb:detail:${scriptId}`
    );
    const raw = data?.script?.script;
    if (typeof raw === "string" && raw.trim()) {
      return { content: raw, source: "scriptblox" };
    }
    return null;
  }

  if (id.startsWith("rscripts-")) {
    const scriptId = id.slice("rscripts-".length);
    const data = await fetchJson<{ script?: Record<string, unknown> }>(
      `${RSCRIPTS_API}/script?id=${encodeURIComponent(scriptId)}`,
      `rs:detail:${scriptId}`
    );
    const rawUrl = data?.script?.rawScript;
    if (typeof rawUrl === "string" && rawUrl.startsWith("https://")) {
      const text = await fetch(rawUrl, { cache: "no-store" })
        .then((res) => (res.ok ? res.text() : ""))
        .catch(() => "");
      if (text.trim()) return { content: text, source: "rscripts" };
    }
    return null;
  }

  return null;
}