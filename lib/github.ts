const GITHUB_API = "https://api.github.com";

export interface GitHubFileMeta {
  sha: string;
  content: string;
}

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const dataPath = process.env.GITHUB_DATA_PATH || "data/scripts.json";

  if (!token || !repo) {
    return null;
  }

  return { token, repo, branch, dataPath };
}

export function isGitHubConfigured(): boolean {
  return getGitHubConfig() !== null;
}

async function githubFetch(path: string, init?: RequestInit) {
  const config = getGitHubConfig();
  if (!config) {
    throw new Error("GitHub is not configured");
  }

  const [owner, repo] = config.repo.split("/");
  if (!owner || !repo) {
    throw new Error("GITHUB_REPO must be in owner/repo format");
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${body}`);
  }

  return res.json();
}

export async function readFileFromGitHub(): Promise<GitHubFileMeta | null> {
  const config = getGitHubConfig();
  if (!config) return null;

  try {
    const data = await githubFetch(
      `/contents/${config.dataPath}?ref=${config.branch}`
    );

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return { sha: data.sha, content };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("404")) {
      return null;
    }
    throw e;
  }
}

export async function writeFileToGitHub(
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  const config = getGitHubConfig();
  if (!config) {
    throw new Error("GitHub is not configured");
  }

  const encoded = Buffer.from(content, "utf-8").toString("base64");

  await githubFetch(`/contents/${config.dataPath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: encoded,
      branch: config.branch,
      ...(sha ? { sha } : {}),
    }),
  });
}
