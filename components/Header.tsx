"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Shield, Skull, Swords, Wifi, Search, Menu, X, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DiscordButton } from "./DiscordButton";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [discordUrl, setDiscordUrl] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setDiscordUrl(data.discordUrl || ""))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMenuOpen(false);
    }
  }, [search, router]);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/executors", label: "Executors", icon: Wifi },
    { href: "/obfuscator", label: "Obfuscator", icon: Skull },
    { href: "/admin", label: "Admin", icon: Shield },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-glass-border/60 bg-alliance-black/80 shadow-glass-sm backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-glass-accent/10 ring-1 ring-glass-accent/30 transition group-hover:shadow-glow-sm"
          >
            <Swords className="h-5 w-5 text-glass-accent-bright" />
          </motion.div>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-glass-accent-bright">
              Dark Alliance
            </p>
            <p className="text-[10px] text-glass-muted/70 -mt-0.5">Script Store</p>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="mx-3 hidden flex-1 sm:block max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-glass-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search scripts..."
              className="w-full rounded-xl border border-glass-border bg-alliance-darker/50 py-2 pl-9 pr-3 text-sm text-white placeholder-glass-muted/50 outline-none transition-all focus:border-glass-accent/50 focus:ring-1 focus:ring-glass-accent/20"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-1 sm:flex">
          <DiscordButton discordUrl={discordUrl} size="sm" className="hidden lg:inline-flex" />
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive(l.href)
                  ? "bg-glass-accent/10 text-glass-accent-bright shadow-sm"
                  : "text-glass-muted hover:bg-alliance-dark/50 hover:text-white"
              }`}
            >
              {l.icon && <l.icon className="h-4 w-4" />}
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-1 text-sm text-glass-muted hover:text-white sm:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-glass-border/60 bg-alliance-black/95 backdrop-blur-xl"
          >
            <div className="px-4 pb-5 pt-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-glass-muted" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search scripts..."
                    className="input-field w-full pl-10"
                    autoFocus
                  />
                </div>
              </form>
              <div className="flex flex-col gap-1">
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive(l.href)
                          ? "bg-glass-accent/10 text-glass-accent-bright"
                          : "text-glass-muted hover:bg-alliance-dark hover:text-white"
                      }`}
                    >
                      {l.icon && <l.icon className="h-4 w-4" />}
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
                <DiscordButton discordUrl={discordUrl} size="sm" className="mt-2" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}