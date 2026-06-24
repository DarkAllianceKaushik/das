import { StoreSwitcher } from "@/components/StoreSwitcher";
import { DiscordButton } from "@/components/DiscordButton";
import { getScriptsData } from "@/lib/scripts";
import { Flame, TrendingUp, Users, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { scripts, categories, settings } = await getScriptsData();

  const freeCount = scripts.filter((s) => s.pricing === "free").length;
  const paidCount = scripts.filter((s) => s.pricing === "paid").length;

  return (
    <>
      <section className="relative overflow-hidden border-b border-glass-border/40 pb-16 pt-20 sm:pb-20 sm:pt-28">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-glass-accent/30 bg-glass-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-glass-accent-bright">
              <Flame className="size-3" />
              Roblox Script Store
              <Sparkles className="size-3" />
            </div>

            <h1 className="animate-fade-in font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl">
              <span className="text-white">Dark Alliance</span>
              <br />
              <span className="bg-gradient-to-r from-glass-accent-bright via-glass-accent to-glass-accent-dim bg-clip-text text-transparent">
                Script Store
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl animate-fade-in text-base leading-relaxed text-glass-muted sm:text-lg">
              Curated Roblox scripts, battle-tested and ready to use.
              Browse the vault or search live results from ScriptBlox &amp; RScripts.
            </p>

            {settings.discordUrl && (
              <div className="mt-8 flex animate-fade-in justify-center">
                <DiscordButton discordUrl={settings.discordUrl} className="sm:hidden" />
              </div>
            )}

            <div className="mt-10 grid animate-fade-in grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
              <StatCard value={scripts.length} label="Total Scripts" icon={<TrendingUp className="size-3.5" />} color="text-glass-accent-bright" />
              <StatCard value={freeCount} label="Free" icon={<Users className="size-3.5" />} color="text-emerald-400" />
              <StatCard value={paidCount} label="Paid" icon={<Sparkles className="size-3.5" />} color="text-amber-400" />
              <StatCard value={categories.length} label="Categories" icon={<Flame className="size-3.5" />} color="text-white" />
            </div>
          </div>
        </div>

        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-accent/30 to-transparent" />
      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        <StoreSwitcher scripts={scripts} categories={categories} />
      </div>
    </>
  );
}

function StatCard({ value, label, icon, color }: { value: number; label: string; icon: React.ReactNode; color: string }) {
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
