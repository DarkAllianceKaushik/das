"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Script } from "@/lib/types";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { getViewCount, trackView } from "@/lib/analytics";
import { submitReport } from "@/lib/reporting";
import { Heart, Flag, Eye, X, Copy, Check, TrendingUp, Sparkles } from "lucide-react";
import { Button, Card, Chip, Select, Label, ListBox, TextArea } from "@heroui/react";

const TRENDING_THRESHOLD = 10;

interface Props {
  script: Script;
  onTagClick?: (tag: string) => void;
}

export function ScriptCardEnhanced({ script, onTagClick }: Props) {
  const [faved, setFaved] = useState(false);
  const [views, setViews] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [reported, setReported] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFaved(isFavorite(script.id));
    setViews(getViewCount(script.id));
    trackView(script.id);
  }, [script.id]);

  const handleFav = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = toggleFavorite(script.id);
    setFaved(now);
    setViews(getViewCount(script.id));
  }, [script.id]);

  const handleReport = useCallback(() => {
    if (!reportReason) return;
    submitReport(script.id, reportReason, reportDetail);
    setReported(true);
    setShowReport(false);
    setReportReason("");
    setReportDetail("");
  }, [script.id, reportReason, reportDetail]);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(script.downloadUrl);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
    } catch {
      await navigator.clipboard.writeText(script.downloadUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [script.downloadUrl]);

  const handleTagClickWrapper = useCallback((tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTagClick) onTagClick(tag);
  }, [onTagClick]);

  const isTrending = views >= TRENDING_THRESHOLD;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative"
    >
      <Link href={`/scripts/${script.id}`} className="block">
        <Card className="group flex flex-col p-5 transition-all duration-200 hover:border-alliance-red/40 hover:shadow-glow-sm">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {script.featured && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Chip color="accent" variant="soft" size="sm">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </Chip>
                </motion.span>
              )}
              {isTrending && (
                <Chip color="warning" variant="soft" size="sm">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </Chip>
              )}
              <Chip
                color={script.pricing === "free" ? "success" : "warning"}
                variant="soft"
                size="sm"
              >
                {script.pricing === "free" ? "Free" : "Paid"}
              </Chip>
              {script.version && (
                <Chip variant="secondary" size="sm" className="bg-alliance-darker text-alliance-muted">
                  v{script.version}
                </Chip>
              )}
            </div>
            <Chip variant="secondary" size="sm" className="bg-alliance-darker text-alliance-muted">
              {script.category}
            </Chip>
          </div>

          <h3 className="font-display text-lg font-bold text-white transition group-hover:text-alliance-red-bright">
            {script.name}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-alliance-muted line-clamp-2">
            {script.description}
          </p>

          {script.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {script.tags.map((tag) => (
                <span
                  key={tag}
                  onClick={(e) => handleTagClickWrapper(tag, e)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-alliance-darker px-2 py-0.5 text-xs text-alliance-muted transition hover:bg-alliance-red/20 hover:text-alliance-red-bright"
                >
                  <span className="text-alliance-red/60">#</span>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 text-xs text-alliance-muted">
            <span className="inline-flex items-center gap-1 rounded-md bg-alliance-black/60 px-2 py-1">
              <Eye className="h-3 w-3" />
              {views}
            </span>
          </div>
        </Card>
      </Link>

      <div className="absolute right-3 top-3 flex gap-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFav}
          className="rounded-md bg-alliance-black/60 p-1.5 text-alliance-muted transition hover:bg-alliance-black hover:text-alliance-red-bright"
          title={faved ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-3.5 w-3.5 ${faved ? "fill-alliance-red-bright text-alliance-red-bright" : ""}`} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className="rounded-md bg-alliance-black/60 p-1.5 text-alliance-muted transition hover:bg-alliance-black hover:text-sky-400"
          title={copied ? "Copied!" : "Copy script"}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowReport(!showReport)}
          className="rounded-md bg-alliance-black/60 p-1.5 text-alliance-muted transition hover:bg-alliance-black hover:text-amber-400"
          title="Report script"
        >
          <Flag className="h-3.5 w-3.5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card-surface absolute left-0 right-0 top-0 z-30 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-amber-400">Report Script</h4>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowReport(false)}
                className="text-alliance-muted hover:text-white"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
            <Select
              selectedKey={reportReason || undefined}
              onSelectionChange={(k) => setReportReason(k === null ? "" : String(k))}
              placeholder="Select reason..."
              variant="primary"
              className="mb-2"
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
              className="mb-3 min-h-20 resize-none text-xs"
            />
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                isDisabled={!reportReason}
                onPress={handleReport}
                className="flex-1 text-xs"
              >
                <Flag className="h-3 w-3" /> Submit Report
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reported && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute left-0 right-0 top-0 z-30 rounded-xl border border-emerald-800/50 bg-emerald-950/80 p-4 text-center text-sm text-emerald-400 backdrop-blur-sm"
          >
            Report submitted. Thank you.
            <button onClick={() => setReported(false)} className="ml-2 underline">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
