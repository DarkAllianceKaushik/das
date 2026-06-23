import Link from "next/link";
import { ExternalLink, Eye, Key, ShieldCheck } from "lucide-react";
import type { ExternalScript } from "@/lib/external-types";

const sourceStyles = {
  scriptblox: {
    label: "ScriptBlox",
    badge: "bg-sky-950/50 text-sky-300 ring-sky-800/50",
  },
  rscripts: {
    label: "RScripts",
    badge: "bg-violet-950/50 text-violet-300 ring-violet-800/50",
  },
};

const pricingStyles: Record<
  ExternalScript["pricing"],
  { label: string; className: string }
> = {
  free: {
    label: "Free",
    className: "bg-emerald-950/60 text-emerald-400 ring-emerald-800/50",
  },
  paid: {
    label: "Paid",
    className: "bg-amber-950/60 text-amber-400 ring-amber-800/50",
  },
  key: {
    label: "Key",
    className: "bg-orange-950/60 text-orange-400 ring-orange-800/50",
  },
};

export function ExternalScriptCard({ script }: { script: ExternalScript }) {
  const src = sourceStyles[script.source];
  const price = pricingStyles[script.pricing];

  return (
    <Link href={`/scripts/${script.id}`} className="block">
      <article className="card-surface group flex flex-col overflow-hidden transition hover:border-alliance-red/40 hover:shadow-glow-sm">
        {script.imageUrl && (
          <div className="relative h-36 w-full overflow-hidden bg-alliance-darker">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={script.imageUrl}
              alt=""
              className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-alliance-card to-transparent" />
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${src.badge}`}
            >
              {src.label}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ring-1 ${price.className}`}
            >
              {script.pricing === "key" && (
                <Key className="mr-0.5 inline h-3 w-3" />
              )}
              {price.label}
            </span>
            {script.verified && (
              <span className="inline-flex items-center gap-0.5 text-xs text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            )}
            {script.patched && (
              <span className="text-xs text-red-400/80">Patched</span>
            )}
          </div>

          <h3 className="font-display text-lg font-bold text-white group-hover:text-alliance-red-bright transition line-clamp-2">
            {script.name}
          </h3>

          <p className="mt-1 text-xs text-alliance-red/70">{script.game}</p>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-alliance-muted line-clamp-3">
            {script.description}
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-alliance-muted">
            <Eye className="h-3.5 w-3.5" />
            {script.views.toLocaleString()} views
          </div>

          <div className="mt-4 flex gap-2">
            <span className="btn-primary flex-1 text-center text-sm">
              View Details
            </span>
            <a
              href={script.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-secondary inline-flex items-center gap-1.5 px-3 text-sm"
              title={`Open on ${src.label}`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </article>
    </Link>
  );
}
