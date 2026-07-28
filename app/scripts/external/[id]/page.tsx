import { notFound } from "next/navigation";
import { fetchExternalScriptById } from "@/lib/external-scripts";
import { ExternalScriptDetailClient } from "@/components/ExternalScriptDetailClient";

export default async function ExternalScriptDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const script = await fetchExternalScriptById(id);
  if (!script) notFound();

  return <ExternalScriptDetailClient script={script} />;
}