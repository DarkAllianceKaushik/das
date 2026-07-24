import { notFound } from "next/navigation";
import type { Executor } from "@/lib/executor-types";
import { ExecutorDetailClient } from "./client";

export const dynamic = "force-dynamic";

async function fetchFromWEAO(): Promise<Executor[]> {
  try {
    const res = await fetch("https://weao.xyz/api/status/exploits", {
      headers: { "User-Agent": "WEAO-3PService" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.result ?? [];
    return list.filter((e: Executor) => e?.title);
  } catch {
    return [];
  }
}

export default async function ExecutorDetailPage(props: { params: Promise<{ slug: string }> }) {
  const resolved = await props.params;
  const executors = await fetchFromWEAO();
  const slug = resolved.slug;
  const executor = executors.find(
    (e) => e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === slug
  );
  if (!executor) notFound();
  return <ExecutorDetailClient executor={executor} />;
}
