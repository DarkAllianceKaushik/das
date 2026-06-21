import { notFound } from "next/navigation";
import { fetchExecutors } from "@/lib/executors";
import { ExecutorDetailClient } from "./client";

export const dynamic = "force-dynamic";

export default async function ExecutorDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolved = await params;
  const executors = await fetchExecutors();
  const slug = resolved.slug;
  const executor = executors.find(
    (e) => e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === slug
  );
  if (!executor) notFound();
  return <ExecutorDetailClient executor={executor} />;
}
