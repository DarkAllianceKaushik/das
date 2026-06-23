"use client";

import { useState, useMemo } from "react";
import { ExecutorCard } from "@/components/executor/ExecutorCard";
import type { Executor } from "@/lib/executor-types";
import { Wifi, Skull, PackageOpen, Search, AlertTriangle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  executors: Executor[];
}

export function ExecutorPageClient({ executors }: Props) {
  const [errored, setErrored] = useState(executors.length === 0);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [price, setPrice] = useState("all");

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
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-glass-accent/30 bg-glass-accent/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-glass-accent-bright">
          <Wifi className="h-3.5 w-3.5" /> Executor Status
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-white">Roblox</span>
          <br />
          <span className="bg-gradient-to-r from-glass-accent-bright via-glass-accent to-glass-accent-dim bg-clip-text text-transparent">
            Executor Status
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-glass-muted sm:text-lg">
          Live status from <span className="text-white">WEAO</span> — check which executors are working, detected, or outdated.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Card className="card-glass">
            <CardContent className="flex flex-col items-center px-5 py-3">
              <p className="font-display text-2xl font-bold text-emerald-400">{working}</p>
              <p className="text-xs text-glass-muted">Working</p>
            </CardContent>
          </Card>
          <Card className="card-glass">
            <CardContent className="flex flex-col items-center px-5 py-3">
              <p className="font-display text-2xl font-bold text-red-400">{detected}</p>
              <p className="text-xs text-glass-muted">Detected</p>
            </CardContent>
          </Card>
          <Card className="card-glass">
            <CardContent className="flex flex-col items-center px-5 py-3">
              <p className="font-display text-2xl font-bold text-white">{executors.length}</p>
              <p className="text-xs text-glass-muted">Total Tracked</p>
            </CardContent>
          </Card>
        </div>
      </section>

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

      <p className="mt-8 text-center text-xs text-glass-muted">
        Data sourced from{" "}
        <a href="https://weao.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">WEAO</a>
        {" "}— updates automatically.
      </p>
    </div>
  );
}
