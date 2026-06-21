import { fetchExecutors } from "@/lib/executors";
import { ExecutorPageClient } from "./client";

export const dynamic = "force-dynamic";

export default async function ExecutorsPage() {
  const executors = await fetchExecutors();
  return <ExecutorPageClient executors={executors} />;
}
