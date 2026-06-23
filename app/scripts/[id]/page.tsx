import { notFound } from "next/navigation";
import { getAllScripts } from "@/lib/scripts";
import { fetchExternalScriptById } from "@/lib/external-scripts";
import { ScriptDetailClient } from "./client";
import { ExternalScriptDetailClient } from "@/components/ExternalScriptDetailClient";

export default async function ScriptDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolved = await params;

  const scripts = await getAllScripts();
  const script = scripts.find((s) => s.id === resolved.id);

  if (script) {
    const related = scripts
      .filter(
        (s) =>
          s.id !== script.id &&
          (s.category === script.category ||
            s.tags.some((t) => script.tags.includes(t)))
      )
      .slice(0, 3);

    return <ScriptDetailClient script={script} relatedScripts={related} />;
  }

  const external = await fetchExternalScriptById(resolved.id);
  if (external) {
    return <ExternalScriptDetailClient script={external} />;
  }

  notFound();
}
