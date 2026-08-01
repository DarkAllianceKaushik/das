"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Download, Tag, Clock, RefreshCw, Heart, Eye, Flag, X,
  Lock, Globe, ExternalLink, AlertTriangle, Calendar, Check,
  Share2, TrendingUp,
} from "lucide-react";
import { ScriptPreview } from "@/components/ScriptPreview";
import { ScriptCardEnhanced } from "@/components/ScriptCardEnhanced";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { getViewCount, trackView } from "@/lib/analytics";
import { submitReport } from "@/lib/reporting";
import { Button, Card, Chip, Select, Label, ListBox, TextArea } from "@heroui/react";
import type { Script } from "@/lib/types";

const TRENDING_THRESHOLD = 10;

interface Props {
  script: Script;
  relatedScripts?: Script[];
}

const LINK_LABELS: Record<string, { label: string; color: string }> = {
  pastebin: { label: "Pastebin", color: "text-emerald-400" },
  linkvertise: { label: "Linkvertise", color: "text-amber-400" },
  direct: { label: "Direct", color: "text-sky-400" },
  other: { label: "External", color: "text-violet-400" },
};

export function ScriptDetailClient({ script, relatedScripts }: Props) {
  const [faved, setFaved] = useState(false);
  const [views, setViews] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [reported, setReported] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    setFaved(isFavorite(script.id));
    setViews(getViewCount(script.id));
    trackView(script.id);
  }, [script.id]);

  const handleFav = useCallback(() => {
    const now = toggleFavorite(script.id);
    setFaved(now);
  }, [script.id]);

  const handleReport = useCallback(() => {
    if (!reportReason) return;
    submitReport(script.id, reportReason, reportDetail);
    setReported(true);
    setShowReport(false);
    setReportReason("");
    setReportDetail("");
  }, [script.id, reportReason, reportDetail]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }, []);

  const loadCode = useCallback(async () => {
    if (!script.downloadUrl || code !== null || codeLoading) return;
    setCodeLoading(true);
    try {
      const res = await fetch(script.downloadUrl);
      const text = await res.text();
      setCode(text);
    } catch {
      setCode(null);
    } finally {
      setCodeLoading(false);
    }
  }, [script.downloadUrl, code, codeLoading]);

  const linkInfo = LINK_LABELS[script.linkType] || LINK_LABELS.other;
  const isTrending = views >= TRENDING_THRESHOLD;

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-alliance-muted transition hover:text-white">
        <ArrowLeft className="size-4" /> Back to Store
      </Link>

      <Card className="mb-8 border border-alliance-border bg-alliance-card/80 p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Chip variant="secondary" size="sm" className="bg-alliance-darker text-alliance-muted">
                {script.category}
              </Chip>
              <Chip
                color={script.pricing === "free" ? "success" : "warning"}
                variant="soft"
                size="sm"
                className={
                  script.pricing === "free"
                    ? "border-emerald-800/40 bg-emerald-950/50 text-emerald-400"
                    : "border-amber-800/40 bg-amber-950/50 text-amber-400"
                }
              >
                {script.pricing === "free" ? "Free" : "Paid"}
              </Chip>
              {script.featured && (
                <Chip color="accent" variant="soft" size="sm">
                  Featured
                </Chip>
              )}
              {isTrending && (
                <Chip color="warning" variant="soft" size="sm">
                  <TrendingUp className="mr-0.5 size-3" />Trending
                </Chip>
              )}
              {script.version && (
                <Chip variant="secondary" size="sm" className="font-mono bg-alliance-darker text-alliance-muted">
                  v{script.version}
                </Chip>
              )}
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">{script.name}</h1>
            {script.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {script.tags.map((t) => (
                  <Chip key={t} variant="secondary" size="sm" className="gap-1 bg-alliance-darker text-alliance-muted">
                    <Tag className="size-3" /> {t}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              isIconOnly
              onPress={handleShare}
              aria-label={linkCopied ? "Link copied!" : "Copy link"}
            >
              {linkCopied ? <Check className="size-4 text-emerald-400" /> : <Share2 className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              isIconOnly
              onPress={handleFav}
              aria-label={faved ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`size-4 ${faved ? "fill-alliance-red-bright text-alliance-red-bright" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              isIconOnly
              onPress={() => setShowReport(!showReport)}
              aria-label="Report script"
            >
              <Flag className="size-4" />
            </Button>
          </div>
        </div>

        <p className="mb-6 text-base leading-relaxed text-alliance-muted">{script.description}</p>

        {script.changelog && (
          <div className="mb-6 rounded-xl border border-alliance-border/60 bg-alliance-darker/50 p-4">
            <h4 className="mb-2 flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-widest text-alliance-muted">
              <Clock className="size-3" /> Changelog {script.version ? `(v${script.version})` : ""}
            </h4>
            <p className="text-sm text-alliance-muted whitespace-pre-wrap">{script.changelog}</p>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-alliance-muted">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3.5" /> {views} views
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" /> Added {new Date(script.createdAt).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> Updated {new Date(script.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={script.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <Download className="size-4" /> Download <ExternalLink className="size-3" />
          </a>
          <Chip
            variant="secondary"
            size="md"
            className={`gap-1.5 px-3 py-1.5 text-xs font-semibold ${linkInfo.color}`}
          >
            <Globe className="size-3.5" /> {linkInfo.label}
          </Chip>
        </div>
      </Card>

      {showReport && (
        <Card className="mb-8 border border-amber-800/40 bg-alliance-card/80 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-amber-400">
              <Flag className="size-4" />Report Script
            </h3>
            <Button variant="ghost" size="sm" isIconOnly onPress={() => setShowReport(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <Select
            selectedKey={reportReason || undefined}
            onSelectionChange={(k) => setReportReason(k === null ? "" : String(k))}
            placeholder="Select reason..."
            variant="primary"
            className="mb-3"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover placement="bottom">
              <ListBox>
                <ListBox.Item id="broken"><Label>Broken / Not working</Label></ListBox.Item>
                <ListBox.Item id="outdated"><Label>Outdated</Label></ListBox.Item>
                <ListBox.Item id="malicious"><Label>Malicious / Virus</Label></ListBox.Item>
                <ListBox.Item id="wrong"><Label>Wrong category / Info</Label></ListBox.Item>
                <ListBox.Item id="other"><Label>Other</Label></ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
          <TextArea
            value={reportDetail}
            onChange={(e) => setReportDetail(e.target.value)}
            placeholder="Additional details (optional)"
            variant="primary"
            className="mb-4 min-h-24 resize-none"
          />
          <Button
            variant="danger"
            isDisabled={!reportReason}
            onPress={handleReport}
          >
            <Flag className="size-4" /> Submit Report
          </Button>
        </Card>
      )}

      {reported && (
        <Card className="mb-8 border border-emerald-800/40 bg-emerald-950/30 p-4 text-center text-sm text-emerald-400">
          Report submitted. Thank you.
          <button onClick={() => setReported(false)} className="ml-2 underline hover:text-emerald-300">Dismiss</button>
        </Card>
      )}

      <Card className="overflow-hidden border border-alliance-border bg-alliance-card/80">
        <div className="flex items-center justify-between border-b border-alliance-border/60 bg-alliance-darker/80 px-5 py-3">
          <h2 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-widest text-alliance-muted">
            <AlertTriangle className="size-3.5" /> Script Code
          </h2>
          <Button
            variant="outline"
            size="sm"
            onPress={loadCode}
            isDisabled={codeLoading || code !== null}
          >
            <RefreshCw className={`size-3.5 ${codeLoading ? "animate-spin" : ""}`} />
            {codeLoading ? "Loading..." : code !== null ? "Loaded" : "Load Code"}
          </Button>
        </div>
        {code ? (
          <ScriptPreview code={code} title={script.name} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Lock className="mb-3 size-10 text-alliance-muted/30" />
            <p className="font-display text-sm text-alliance-muted">Code hidden</p>
            <p className="mt-1 text-xs text-alliance-muted/60">
              Click <strong className="text-white">Load Code</strong> above to fetch the script source from {linkInfo.label}.
            </p>
          </div>
        )}
      </Card>

      {relatedScripts && relatedScripts.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-alliance-muted">
            Related Scripts
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedScripts.map(s => (
              <ScriptCardEnhanced key={s.id} script={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
