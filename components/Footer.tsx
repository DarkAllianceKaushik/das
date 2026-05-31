import { DiscordButton } from "./DiscordButton";

interface FooterProps {
  discordUrl?: string;
}

export function Footer({ discordUrl = "" }: FooterProps) {
  return (
    <footer className="relative z-10 mt-auto border-t border-alliance-border/80 bg-alliance-darker/80">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-alliance-red/80">
          Dark Alliance Script Store
        </p>
        {discordUrl && (
          <div className="mt-4 flex justify-center">
            <DiscordButton discordUrl={discordUrl} />
          </div>
        )}
        <p className="mt-4 text-xs text-alliance-muted">
          Roblox scripts for educational purposes. Use responsibly.
        </p>
        <p className="mt-4 text-xs text-alliance-muted/60">
          © {new Date().getFullYear()} Dark Alliance. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
