const GITHUB_API = "https://api.github.com";

export interface GitHubFileMeta {
  sha: string;
  content: string;
}

export interface GitHubConfig {
  token: string;
  repo: string;
  branch: string;
  dataPath: string;
}

function trimEnv(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v || undefined;
}

export function getGitHubConfig(): GitHubConfig | null {
  const token = trimEnv(process.env.GITHUB_TOKEN);
  const repo = trimEnv(process.env.GITHUB_REPO);
  const branch = trimEnv(process.env.GITHUB_BRANCH) || "main";
  const dataPath = trimEnv(process.env.GITHUB_DATA_PATH) || "data/scripts.json";

  if (!repo) {
    return null;
  }

  return {
    token: token || "",
    repo,
    branch,
    dataPath,
  };
}

/** Repo is set (production GitHub mode). Token may still be invalid. */
export function isGitHubRepoConfigured(): boolean {
  return getGitHubConfig() !== null;
}

/** Token + repo set — required for admin writes. */
export function isGitHubConfigured(): boolean {
  const config = getGitHubConfig();
  return Boolean(config?.token && config.repo);
}

function parseRepo(repo: string): { owner: string; name: string } {
  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    throw new Error("GITHUB_REPO must be in owner/repo format (e.g. DarkAllianceKaushik/das)");
  }
  return { owner, name };
}

async function githubFetch(
  path: string,
  init?: RequestInit,
  options?: { useToken?: boolean }
): Promise<Response> {
  const config = getGitHubConfig();
  if (!config) {
    throw new Error("GitHub is not configured");
  }

  const { owner, name } = parseRepo(config.repo);
  const url = `${GITHUB_API}/repos/${owner}/${name}${path}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...((init?.headers as Record<string, string>) || {}),
  };

  if (options?.useToken !== false && config.token) {
    headers.Authorization = `Bearer ${config.token}`;
  }

  return fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });
}

async function readViaPublicRaw(): Promise<string | null> {
  const config = getGitHubConfig();
  if (!config) return null;

  const { owner, name } = parseRepo(config.repo);
  const url = `https://raw.githubusercontent.com/${owner}/${name}/${config.branch}/${config.dataPath}`;

  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to read public file (${res.status})`);
  }

  return res.text();
}

export async function readFileFromGitHub(): Promise<GitHubFileMeta | null> {
  const config = getGitHubConfig();
  if (!config) return null;

  const path = `/contents/${config.dataPath}?ref=${encodeURIComponent(config.branch)}`;

  // 1) Try with token (gets sha for later writes)
  if (config.token) {
    const authed = await githubFetch(path, undefined, { useToken: true });
    if (authed.ok) {
      const data = await authed.json();
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return { sha: data.sha, content };
    }

    // Bad/expired token — fall through for public repos
    if (authed.status !== 401 && authed.status !== 403) {
      const body = await authed.text();
      if (authed.status === 404) return null;
      throw new Error(`GitHub API error (${authed.status}): ${body}`);
    }
  }

  // 2) Unauthenticated API (public repos, 60 req/hr)
  const publicApi = await githubFetch(path, undefined, { useToken: false });
  if (publicApi.ok) {
    const data = await publicApi.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return { sha: data.sha, content };
  }

  if (publicApi.status === 404) {
    return null;
  }

  // 3) Raw.githubusercontent.com fallback
  if (publicApi.status === 401 || publicApi.status === 403 || !config.token) {
    const raw = await readViaPublicRaw();
    if (raw !== null) {
      return { sha: "", content: raw };
    }
  }

  const body = await publicApi.text();
  throw new Error(`GitHub API error (${publicApi.status}): ${body}`);
}

export async function writeFileToGitHub(
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  const config = getGitHubConfig();
  if (!config?.token) {
    throw new Error(
      "GITHUB_TOKEN is missing or invalid. Create a new token at https://github.com/settings/tokens with repo scope and update Vercel env vars, then redeploy."
    );
  }

  const encoded = Buffer.from(content, "utf-8").toString("base64");

  const res = await githubFetch(`/contents/${config.dataPath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: encoded,
      branch: config.branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401) {
      throw new Error(
        "GitHub rejected your token (401 Bad credentials). Generate a new Personal Access Token with repo access, set GITHUB_TOKEN in Vercel, and redeploy."
      );
    }
    throw new Error(`GitHub API error (${res.status}): ${body}`);
  }
}
