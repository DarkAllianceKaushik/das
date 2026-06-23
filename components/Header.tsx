"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Shield, Skull, Swords, Wifi, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
    { href: "/", label: "Scripts" },
    { href: "/executors", label: "Executors", icon: Wifi },
    { href: "/obfuscator", label: "Obfuscator", icon: Skull },
    { href: "/admin", label: "Admin", icon: Shield },
  ];

  return (
    <header className="relative z-20 border-b border-glass-border bg-glass-black/70 backdrop-blur-[24px]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-accent/30 bg-glass-accent/10 shadow-glass-sm backdrop-blur-[16px] transition group-hover:bg-glass-accent/20">
            <Swords className="h-5 w-5 text-glass-accent-bright" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-glass-accent-bright">
              Dark Alliance
            </p>
            <p className="text-xs text-glass-muted">Script Store</p>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="mx-3 hidden flex-1 sm:block max-w-xs">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-glass-muted" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search scripts..."
              className="w-full pl-8"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-3 sm:flex sm:gap-4">
          <DiscordButton discordUrl={discordUrl} size="sm" className="hidden lg:inline-flex" />
          {navLinks.map(l => {
            const Icon = l.icon;
            return (
              <Button key={l.href} variant="ghost" size="sm" render={<Link href={l.href} />}>
                {Icon && <Icon className="h-4 w-4" />}
                <span>{l.label}</span>
              </Button>
            );
          })}
        </nav>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="sm:hidden" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-glass-black/95 backdrop-blur-[24px] border-glass-border">
            <SheetHeader>
              <SheetTitle className="text-glass-accent-bright font-display text-sm uppercase tracking-widest">
                Menu
              </SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSearch} className="mt-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-glass-muted" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search scripts..."
                  className="w-full pl-10"
                  autoFocus
                />
              </div>
            </form>
            <div className="flex flex-col gap-2">
              {navLinks.map(l => {
                const Icon = l.icon;
                return (
                  <Button key={l.href} variant="ghost" className="w-full justify-start" render={<Link href={l.href} />} onClick={() => setMenuOpen(false)}>
                    {Icon && <Icon className="h-4 w-4 mr-2" />}
                    {l.label}
                  </Button>
                );
              })}
              <DiscordButton discordUrl={discordUrl} size="sm" className="mt-2" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
