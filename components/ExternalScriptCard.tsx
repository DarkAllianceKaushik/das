import Link from "next/link";
import { ExternalLink, Eye, Key, ShieldCheck } from "lucide-react";
import type { ExternalScript } from "@/lib/external-types";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    className: "border-emerald-800/50 bg-emerald-950/60 text-emerald-400",
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

  return (
    <Link href={`/scripts/${script.id}`} className="block">
      <Card className="group flex flex-col overflow-hidden transition hover:border-glass-accent/30 hover:shadow-glass">
        {script.imageUrl && (
          <div className="relative h-36 w-full overflow-hidden bg-glass-darker">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={script.imageUrl}
              alt=""
              className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-glass-card to-transparent" />
          </div>
        )}

        <CardContent className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={src.className}>
              {src.label}
            </Badge>
            <Badge variant="outline" className={price.className}>
              {script.pricing === "key" && (
                <Key className="mr-0.5 inline h-3 w-3" />
              )}
              {price.label}
            </Badge>
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

          <CardTitle className="font-display text-lg font-bold text-white transition group-hover:text-glass-accent-bright line-clamp-2">
            {script.name}
          </CardTitle>

          <p className="mt-1 text-xs text-glass-accent/70">{script.game}</p>

          <CardDescription className="mt-2 flex-1 text-sm leading-relaxed text-glass-muted line-clamp-3">
            {script.description}
          </CardDescription>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-glass-muted">
            <Eye className="h-3.5 w-3.5" />
            {script.views.toLocaleString()} views
          </div>

          <div className="mt-4 flex gap-2">
            <span className={cn(buttonVariants({ className: "flex-1 text-sm cursor-pointer" }))}>
              View Details
            </span>
            <Button
              variant="outline"
              size="icon"
              render={<a href={script.url} target="_blank" rel="noopener noreferrer" />}
              className="shrink-0"
              title={`Open on ${src.label}`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
