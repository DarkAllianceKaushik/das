import { ExternalLink, Eye, Key, ShieldCheck, Smartphone, ThumbsUp, ThumbsDown } from "lucide-react";
import type { ExternalScript } from "@/lib/external-types";
import { Card, Chip, Button } from "@heroui/react";

const sourceStyles = {
  scriptblox: {
    label: "ScriptBlox",
    className: "border-sky-800/50 bg-sky-950/50 text-sky-300",
  },
  rscripts: {
    label: "RScripts",
    className: "border-violet-800/50 bg-violet-950/50 text-violet-300",
  },
};

const pricingStyles: Record<
  ExternalScript["pricing"],
  { label: string; className: string }
> = {
  free: {
    label: "Free",
    className: "border-amber-800/50 bg-amber-950/60 text-amber-400",
  },
  paid: {
    label: "Paid",
    className: "border-amber-800/50 bg-amber-950/60 text-amber-400",
  },
  key: {
    label: "Key",
    className: "border-orange-800/50 bg-orange-950/60 text-orange-400",
  },
};

export function ExternalScriptCard({ script }: { script: ExternalScript }) {
  const src = sourceStyles[script.source];
  const price = pricingStyles[script.pricing];
  const totalRatings = (script.likes ?? 0) + (script.dislikes ?? 0);
  const score = totalRatings > 0 ? Math.round(((script.likes ?? 0) / totalRatings) * 100) : 0;

  return (
    <a href={script.url} target="_blank" rel="noopener noreferrer" className="block">
      <Card className="group flex flex-col overflow-hidden transition hover:border-alliance-red/40 hover:shadow-glow-sm">
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

        <Card.Content className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Chip size="sm" className={src.className}>
              {src.label}
            </Chip>
            <Chip size="sm" className={price.className}>
              {script.pricing === "key" && (
                <Key className="mr-0.5 inline h-3 w-3" />
              )}
              {price.label}
            </Chip>
            {script.verified && (
              <span className="inline-flex items-center gap-0.5 text-xs text-amber-400">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            )}
            {script.patched && (
              <span className="text-xs text-rose-400/80">Patched</span>
            )}
            {script.universal && (
              <Chip size="sm" className="border-blue-800/40 bg-blue-950/50 text-blue-400 text-[10px] px-1.5 py-0">
                Universal
              </Chip>
            )}
            {script.mobileReady && (
              <span className="inline-flex items-center gap-0.5 text-xs text-purple-400">
                <Smartphone className="h-3 w-3" />
                Mobile
              </span>
            )}
          </div>

          <Card.Title className="font-display text-lg font-bold text-white transition group-hover:text-alliance-red-bright line-clamp-2">
            {script.name}
          </Card.Title>

          <p className="mt-1 text-xs text-alliance-red/70">{script.game}</p>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-alliance-muted line-clamp-3">
            {script.description}
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-alliance-muted">
            <Eye className="h-3.5 w-3.5" />
            {script.views.toLocaleString()} views
          </div>

          {script.testedExecutors && script.testedExecutors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {script.testedExecutors.slice(0, 4).map((exe) => (
                <span key={exe} className="rounded bg-alliance-darker px-1.5 py-0.5 text-[10px] text-alliance-muted/80">
                  {exe}
                </span>
              ))}
              {script.testedExecutors.length > 4 && (
                <span className="text-[10px] text-alliance-muted/50">+{script.testedExecutors.length - 4}</span>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button variant="secondary" fullWidth className="flex-1 text-sm">
              View Details
            </Button>
            <a
              href={script.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline shrink-0 !px-3 !py-2"
              title={`Open on ${src.label}`}
              aria-label={`Open on ${src.label}`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </Card.Content>
      </Card>
    </a>
  );
}