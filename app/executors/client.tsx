"use client";

import { useState, useMemo, type ReactNode } from "react";
import { ExecutorCard } from "@/components/executor/ExecutorCard";
import type { Executor } from "@/lib/executor-types";
import { Wifi, PackageOpen, Search, AlertTriangle, RefreshCw, ShieldCheck, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ScrollReveal";

interface Props {
  executors: Executor[];
}

export function ExecutorPageClient({ executors }: Props) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [price, setPrice] = useState("all");

  const errored = executors.length === 0;

  const platforms = useMemo(() => {
    const s = new Set(executors.map(e => e.platform).filter(Boolean));
    return Array.from(s).sort();
  }, [executors]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return executors.filter(e => {
      if (platform !== "all" && e.platform !== platform) return false;
      if (status !== "all") {
        if (status === "working" && (!e.updateStatus || e.detected)) return false;
        if (status === "detected" && !e.detected) return false;
        if (status === "outdated" && e.updateStatus) return false;
      }
      if (price !== "all") {
        if (price === "free" && !e.free) return false;
        if (price === "paid" && e.free) return false;
      }
      if (q && !e.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [executors, search, platform, status, price]);

  const working = executors.filter(e => e.updateStatus && !e.detected).length;
  const detected = executors.filter(e => e.detected).length;

  return (
    <div className="relative z-10">
      <section className="relative overflow-hidden border-b border-glass-border/40 pb-16 pt-20 sm:pb-20 sm:pt-28">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-glass-accent/30 bg-glass-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-glass-accent-bright">
              <Wifi className="size-3" /> Executor Status
            </div>
            <h1 className="animate-fade-in font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl">
              <span className="text-white">Roblox</span>
              <br />
              <span className="bg-gradient-to-r from-glass-accent-bright via-glass-accent to-glass-accent-dim bg-clip-text text-transparent">
                Executor Status
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl animate-fade-in text-base leading-relaxed text-glass-muted sm:text-lg">
              Live status from <span className="text-white font-semibold">WEAO</span> — check which executors are working, detected, or outdated.
            </p>
            <div className="mt-10 grid animate-fade-in grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
              <StatCard value={working} label="Working" icon={<ShieldCheck className="size-3.5" />} color="text-emerald-400" />
              <StatCard value={detected} label="Detected" icon={<AlertTriangle className="size-3.5" />} color="text-red-400" />
              <StatCard value={executors.length} label="Total Tracked" icon={<List className="size-3.5" />} color="text-white" />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-accent/30 to-transparent" />
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">

      <ScrollReveal delay={1}>
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-glass-muted" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search executors..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={platform} onValueChange={(v) => v !== null && setPlatform(v)}>
              <SelectTrigger className="w-auto min-w-[140px]">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => v !== null && setStatus(v)}>
              <SelectTrigger className="w-auto min-w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="working">Working</SelectItem>
                <SelectItem value="detected">Detected</SelectItem>
                <SelectItem value="outdated">Outdated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={price} onValueChange={(v) => v !== null && setPrice(v)}>
              <SelectTrigger className="w-auto min-w-[140px]">
                <SelectValue placeholder="Free & Paid" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Free & Paid</SelectItem>
                <SelectItem value="free">Free Only</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={2}>
        {errored && executors.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border border-amber-800/40 py-16 text-center">
            <CardContent className="flex flex-col items-center">
              <AlertTriangle className="mb-3 h-12 w-12 text-amber-400/60" />
              <p className="font-display text-lg text-amber-400">Unable to fetch executor data</p>
              <p className="mt-1 text-sm text-glass-muted/70">WEAO API might be down or rate-limited. Data will load automatically once available.</p>
              <Button variant="secondary" onClick={() => window.location.reload()} className="mt-4">
                <RefreshCw className="h-4 w-4" /> Retry
              </Button>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <CardContent className="flex flex-col items-center">
              <PackageOpen className="h-12 w-12 text-glass-muted/40" />
              <p className="mt-4 font-display text-lg text-glass-muted">No executors found</p>
              <p className="mt-1 text-sm text-glass-muted/70">Try adjusting your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(e => <ExecutorCard key={e.title} executor={e} />)}
          </div>
        )}
      </ScrollReveal>

      <p className="mt-8 text-center text-xs text-glass-muted">
        Data sourced from{" "}
        <a href="https://weao.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">WEAO</a>
        {" "}— updates automatically.
      </p>
    </div>
    </div>
  );
}

function StatCard({ value, label, icon, color }: { value: number; label: string; icon: ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-glass-border bg-glass-card/60 px-4 py-3 backdrop-blur-2xl transition-all duration-300 hover:border-glass-accent/30 hover:bg-glass-card hover:shadow-[0_0_30px_-5px] hover:shadow-glass-accent/15">
      <div className={`flex size-10 items-center justify-center rounded-xl border border-glass-border bg-glass-dark/60 ${color}`}>
        {icon}
      </div>
      <div className="text-left">
        <p className={`font-display text-xl font-bold leading-none ${color}`}>{value}</p>
        <p className="mt-0.5 text-xs text-glass-muted">{label}</p>
      </div>
    </div>
  );
}
