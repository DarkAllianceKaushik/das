"use client";

import { useState, useMemo } from "react";
import { ExecutorCard } from "@/components/executor/ExecutorCard";
import type { Executor } from "@/lib/executor-types";
import { Wifi, Skull, PackageOpen, Search } from "lucide-react";

interface Props {
  executors: Executor[];
}

export function ExecutorPageClient({ executors }: Props) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");

  const platforms = useMemo(() => {
    const s = new Set(executors.map(e => e.platform).filter(Boolean));
    return Array.from(s).sort();
  }, [executors]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return executors.filter(e => {
      if (platform && e.platform !== platform) return false;
      if (status === "working" && (!e.updateStatus || e.detected)) return false;
      if (status === "detected" && !e.detected) return false;
      if (status === "outdated" && e.updateStatus) return false;
      if (price === "free" && !e.free) return false;
      if (price === "paid" && e.free) return false;
      if (q && !e.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [executors, search, platform, status, price]);

  const working = executors.filter(e => e.updateStatus && !e.detected).length;
  const detected = executors.filter(e => e.detected).length;

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-alliance-red/30 bg-alliance-red/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-alliance-red-bright">
          <Wifi className="h-3.5 w-3.5" /> Executor Status
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-white">Roblox</span>
          <br />
          <span className="bg-gradient-to-r from-alliance-red-bright via-alliance-red to-alliance-crimson bg-clip-text text-transparent">
            Executor Status
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-alliance-muted sm:text-lg">
          Live status from <span className="text-white">WEAO</span> — check which executors are working, detected, or outdated.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="card-surface px-5 py-3">
            <p className="font-display text-2xl font-bold text-emerald-400">{working}</p>
            <p className="text-xs text-alliance-muted">Working</p>
          </div>
          <div className="card-surface px-5 py-3">
            <p className="font-display text-2xl font-bold text-red-400">{detected}</p>
            <p className="text-xs text-alliance-muted">Detected</p>
          </div>
          <div className="card-surface px-5 py-3">
            <p className="font-display text-2xl font-bold text-white">{executors.length}</p>
            <p className="text-xs text-alliance-muted">Total Tracked</p>
          </div>
        </div>
      </section>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-alliance-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search executors..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select value={platform} onChange={e => setPlatform(e.target.value)} className="input-field w-auto min-w-[140px]">
            <option value="">All Platforms</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="input-field w-auto min-w-[140px]">
            <option value="">All Status</option>
            <option value="working">Working</option>
            <option value="detected">Detected</option>
            <option value="outdated">Outdated</option>
          </select>
          <select value={price} onChange={e => setPrice(e.target.value)} className="input-field w-auto min-w-[140px]">
            <option value="">Free & Paid</option>
            <option value="free">Free Only</option>
            <option value="paid">Paid Only</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center py-16 text-center">
          <PackageOpen className="h-12 w-12 text-alliance-muted/40" />
          <p className="mt-4 font-display text-lg text-alliance-muted">No executors found</p>
          <p className="mt-1 text-sm text-alliance-muted/70">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(e => <ExecutorCard key={e.title} executor={e} />)}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-alliance-muted">
        Data sourced from{" "}
        <a href="https://weao.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">WEAO</a>
        {" "}— updates automatically.
      </p>
    </div>
  );
}
