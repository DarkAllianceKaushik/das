import { notFound } from "next/navigation";
import { getAllScripts } from "@/lib/scripts";
import { ScriptDetailClient } from "./client";

export const revalidate = 600;

export default async function ScriptDetailPage(props: { params: Promise<{ id: string }> }) {
  const resolved = await props.params;
  const scripts = await getAllScripts();
  const script = scripts.find((s) => s.id === resolved.id);
  if (!script) notFound();

  const related = scripts
    .filter(s => s.id !== script.id && (
      s.category === script.category ||
      s.tags.some(t => script.tags.includes(t))
    ))
    .slice(0, 3);

  return <ScriptDetailClient script={script} relatedScripts={related} />;
}
