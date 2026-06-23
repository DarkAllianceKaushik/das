import {
  ExternalLink,
  Crown,
  Sparkles,
  Tag,
} from "lucide-react";
import type { Script } from "@/lib/types";

const linkLabels: Record<Script["linkType"], string> = {
  pastebin: "Pastebin",
  linkvertise: "Linkvertise",
  direct: "Direct Link",
  other: "Get Script",
};

export function ScriptCard({ script }: { script: Script }) {
  return (
    <article className="card-surface group flex flex-col p-5 transition hover:border-glass-accent/30 hover:shadow-glass">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {script.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-glass-accent/20 px-2 py-0.5 text-xs font-medium text-glass-accent-bright">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
              script.pricing === "free"
                ? "bg-emerald-950/60 text-emerald-400 ring-1 ring-emerald-800/50"
                : "bg-amber-950/60 text-amber-400 ring-1 ring-amber-800/50"
            }`}
          >
            {script.pricing === "paid" && <Crown className="mr-0.5 inline h-3 w-3" />}
            {script.pricing}
          </span>
        </div>
        <span className="rounded-xl bg-glass-dark/80 px-2 py-1 text-xs text-glass-muted backdrop-blur-[8px]">
          {script.category}
        </span>
      </div>

      <h3 className="font-display text-lg font-bold text-white group-hover:text-glass-accent-bright transition">
        {script.name}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-glass-muted">
        {script.description}
      </p>

      {script.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {script.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-xl bg-glass-dark/60 px-2 py-0.5 text-xs text-glass-muted backdrop-blur-[8px]"
            >
              <Tag className="h-3 w-3 text-glass-accent/60" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <a
        href={script.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-5 w-full"
      >
        <ExternalLink className="h-4 w-4" />
        {linkLabels[script.linkType]}
      </a>
    </article>
  );
}
