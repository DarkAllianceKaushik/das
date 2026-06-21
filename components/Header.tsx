"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Shield, Skull, Swords, Wifi, Search, Menu, X } from "lucide-react";
import { DiscordButton } from "./DiscordButton";

interface HeaderProps {
  discordUrl?: string;
}

export function Header({ discordUrl = "" }: HeaderProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMenuOpen(false);
    }
  }, [search, router]);

  const navLinks = [
    { href: "/", label: "Scripts", icon: null },
    { href: "/executors", label: "Executors", icon: Wifi },
    { href: "/obfuscator", label: "Obfuscator", icon: Skull },
    { href: "/admin", label: "Admin", icon: Shield },
  ];

  return (
    <header className="relative z-20 border-b border-alliance-border/80 bg-alliance-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-alliance-red/20 ring-1 ring-alliance-red/40 transition group-hover:shadow-glow-sm">
            <Swords className="h-5 w-5 text-alliance-red-bright" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-alliance-red-bright">
              Dark Alliance
            </p>
            <p className="text-xs text-alliance-muted">Script Store</p>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="mx-3 hidden flex-1 sm:block max-w-xs">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-alliance-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search scripts..."
              className="w-full rounded-lg border border-alliance-border bg-alliance-darker py-1.5 pl-8 pr-3 text-sm text-white placeholder-alliance-muted outline-none transition focus:border-alliance-red/50"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-3 sm:flex sm:gap-4">
          <DiscordButton discordUrl={discordUrl} size="sm" className="hidden lg:inline-flex" />
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="flex items-center gap-1.5 text-sm text-alliance-muted transition hover:text-alliance-red-bright">
              {l.icon && <l.icon className="h-4 w-4" />}
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>

        <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-1 text-sm text-alliance-muted hover:text-white sm:hidden">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-alliance-border/60 bg-alliance-black/95 px-4 pb-5 pt-4 sm:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-alliance-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search scripts..."
                className="input-field w-full pl-10"
                autoFocus
              />
            </div>
          </form>
          <div className="flex flex-col gap-2">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-alliance-muted transition hover:bg-alliance-dark hover:text-white">
                {l.icon && <l.icon className="h-4 w-4" />}
                {l.label}
              </Link>
            ))}
            <DiscordButton discordUrl={discordUrl} size="sm" className="mt-2" />
          </div>
        </div>
      )}
    </header>
  );
}
