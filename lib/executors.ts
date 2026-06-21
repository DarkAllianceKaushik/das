import type { Executor } from "./executor-types";

export async function fetchExecutors(): Promise<Executor[]> {
  try {
    const base = typeof window !== "undefined" ? "" : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
    const res = await fetch(`${base}/api/executors`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.result ?? [];
    return list.filter((e: Executor) => e?.title);
  } catch {
    return [];
  }
}
