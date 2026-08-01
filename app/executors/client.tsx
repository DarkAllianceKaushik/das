"use client";

import { useState, useMemo, type ReactNode } from "react";
import { ExecutorCard } from "@/components/executor/ExecutorCard";
import type { Executor } from "@/lib/executor-types";
import { Wifi, PackageOpen, Search, AlertTriangle, RefreshCw, ShieldCheck, List } from "lucide-react";
import { Button, Card, Chip, InputGroup, Select, Label, ListBox } from "@heroui/react";
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
      <section className="relative overflow-hidden border-b border-alliance-border/40 pb-16 pt-20 sm:pb-20 sm:pt-28">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex animate-fade-in justify-center">
              <Chip
                variant="soft"
                color="accent"
                className="border border-alliance-red/30 bg-alliance-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-alliance-red-bright"
              >
                <Wifi className="size-3" /> Executor Status
              </Chip>
            </div>
            <h1 className="animate-fade-in font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl">
              <span className="text-white">Roblox</span>
              <br />
              <span className="bg-gradient-to-r from-alliance-red-bright via-alliance-red to-alliance-crimson bg-clip-text text-transparent">
                Executor Status
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl animate-fade-in text-base leading-relaxed text-alliance-muted sm:text-lg">
              Live status from <span className="font-semibold text-white">WEAO</span> — check which executors are working, detected, or outdated.
            </p>
            <div className="mt-10 grid animate-fade-in grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
              <StatCard value={working} label="Working" icon={<ShieldCheck className="size-3.5" />} color="text-amber-400" />
              <StatCard value={detected} label="Detected" icon={<AlertTriangle className="size-3.5" />} color="text-rose-400" />
              <StatCard value={executors.length} label="Total Tracked" icon={<List className="size-3.5" />} color="text-white" />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-alliance-red/30 to-transparent" />
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">

      <ScrollReveal delay={1}>
        <div className="mb-8 space-y-4">
          <InputGroup fullWidth>
            <InputGroup.Prefix>
              <Search className="h-4 w-4 text-alliance-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search executors..."
              aria-label="Search executors"
            />
          </InputGroup>
          <div className="flex flex-wrap gap-3">
            <Select
              selectedKey={platform}
              onSelectionChange={(k) => setPlatform(k === null ? "all" : String(k))}
              placeholder="All Platforms"
              variant="primary"
              className="w-auto min-w-[140px]"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover placement="bottom">
                <ListBox>
                  <ListBox.Item id="all"><Label>All Platforms</Label></ListBox.Item>
                  {platforms.map(p => <ListBox.Item key={p} id={p}><Label>{p}</Label></ListBox.Item>)}
                </ListBox>
              </Select.Popover>
            </Select>
            <Select
              selectedKey={status}
              onSelectionChange={(k) => setStatus(k === null ? "all" : String(k))}
              placeholder="All Status"
              variant="primary"
              className="w-auto min-w-[140px]"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover placement="bottom">
                <ListBox>
                  <ListBox.Item id="all"><Label>All Status</Label></ListBox.Item>
                  <ListBox.Item id="working"><Label>Working</Label></ListBox.Item>
                  <ListBox.Item id="detected"><Label>Detected</Label></ListBox.Item>
                  <ListBox.Item id="outdated"><Label>Outdated</Label></ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
            <Select
              selectedKey={price}
              onSelectionChange={(k) => setPrice(k === null ? "all" : String(k))}
              placeholder="Free & Paid"
              variant="primary"
              className="w-auto min-w-[140px]"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover placement="bottom">
                <ListBox>
                  <ListBox.Item id="all"><Label>Free & Paid</Label></ListBox.Item>
                  <ListBox.Item id="free"><Label>Free Only</Label></ListBox.Item>
                  <ListBox.Item id="paid"><Label>Paid Only</Label></ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={2}>
        {errored && executors.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border border-amber-800/40 py-16 text-center">
            <Card.Content className="flex flex-col items-center">
              <AlertTriangle className="mb-3 h-12 w-12 text-amber-400/60" />
              <p className="font-display text-lg text-amber-400">Unable to fetch executor data</p>
              <p className="mt-1 text-sm text-alliance-muted/70">WEAO API might be down or rate-limited. Data will load automatically once available.</p>
              <Button variant="secondary" onPress={() => window.location.reload()} className="mt-4">
                <RefreshCw className="h-4 w-4" /> Retry
              </Button>
            </Card.Content>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <Card.Content className="flex flex-col items-center">
              <PackageOpen className="h-12 w-12 text-alliance-muted/40" />
              <p className="mt-4 font-display text-lg text-alliance-muted">No executors found</p>
              <p className="mt-1 text-sm text-alliance-muted/70">Try adjusting your filters.</p>
            </Card.Content>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(e => <ExecutorCard key={e.title} executor={e} />)}
          </div>
        )}
      </ScrollReveal>

      <p className="mt-8 text-center text-xs text-alliance-muted">
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
    <div className="flex items-center gap-3 rounded-2xl border border-alliance-border bg-alliance-card/60 px-4 py-3 backdrop-blur-2xl transition-all duration-300 hover:border-alliance-red/30 hover:bg-alliance-card hover:shadow-[0_0_30px_-5px] hover:shadow-alliance-red/15">
      <div className={`flex size-10 items-center justify-center rounded-xl border border-alliance-border bg-alliance-dark/60 ${color}`}>
        {icon}
      </div>
      <div className="text-left">
        <p className={`font-display text-xl font-bold leading-none ${color}`}>{value}</p>
        <p className="mt-0.5 text-xs text-alliance-muted">{label}</p>
      </div>
    </div>
  );
}
