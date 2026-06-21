import Link from "next/link";
import { Shield, Skull, Swords } from "lucide-react";
import { DiscordButton } from "./DiscordButton";

interface HeaderProps {
  discordUrl?: string;
}

export function Header({ discordUrl = "" }: HeaderProps) {
  return (
    <header className="relative z-20 border-b border-alliance-border/80 bg-alliance-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-alliance-red/20 ring-1 ring-alliance-red/40 transition group-hover:shadow-glow-sm">
            <Swords className="h-5 w-5 text-alliance-red-bright" />
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-alliance-red-bright">
              Dark Alliance
            </p>
            <p className="text-xs text-alliance-muted">Script Store</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <DiscordButton discordUrl={discordUrl} size="sm" className="hidden sm:inline-flex" />
          <Link
            href="/"
            className="text-sm text-alliance-muted transition hover:text-white"
          >
            Scripts
          </Link>
          <Link
            href="/obfuscator"
            className="flex items-center gap-1.5 text-sm text-alliance-muted transition hover:text-alliance-red-bright"
          >
            <Skull className="h-4 w-4" />
            <span className="hidden sm:inline">Obfuscator</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm text-alliance-muted transition hover:text-alliance-red-bright"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
