import type { Executor } from "@/lib/executor-types";
import { ExecutorPageClient } from "./client";

export const revalidate = 300;

async function fetchFromWEAO(): Promise<Executor[]> {
  try {
    const res = await fetch("https://weao.xyz/api/status/exploits", {
      headers: { "User-Agent": "WEAO-3PService" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.result ?? [];
    return list.filter((e: Executor) => e?.title);
  } catch {
    return [];
  }
}

export default async function ExecutorsPage() {
  const executors = await fetchFromWEAO();
  return <ExecutorPageClient executors={executors} />;
}
