import { StoreSwitcher } from "@/components/StoreSwitcher";
import { DiscordButton } from "@/components/DiscordButton";
import { getScriptsData } from "@/lib/scripts";
import { Flame, Swords, ArrowRight, Sparkles } from "lucide-react";
import { StoreGridSkeleton } from "@/components/LoadingSkeleton";
import { Suspense } from "react";

export const revalidate = 600;

export default async function HomePage() {
  const { scripts, categories, settings } = await getScriptsData();

  const freeCount = scripts.filter((s) => s.pricing === "free").length;
  const paidCount = scripts.filter((s) => s.pricing === "paid").length;

  return (
    <div className="relative z-10">
      <section className="relative overflow-hidden border-b border-glass-border/40 pb-16 pt-20 sm:pb-20 sm:pt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-glass-accent/5 via-transparent to-transparent" />
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-glass-accent/10 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-glass-accent/30 bg-glass-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-glass-accent-bright">
              <Flame className="size-3" />
              Roblox Script Store
            </div>
            <h1 className="animate-fade-in font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl">
              <span className="text-white">Dark Alliance</span>
              <br />
              <span className="bg-gradient-to-r from-glass-accent-bright via-glass-accent to-glass-accent-dim bg-clip-text text-transparent">
                Script Store
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl animate-fade-in text-base leading-relaxed text-glass-muted sm:text-lg">
              Browse Dark Alliance curated scripts or search live results from
              ScriptBlox and RScripts — all in one place.
            </p>

            {settings.discordUrl && (
              <div className="mt-8 animate-fade-in flex justify-center">
                <DiscordButton discordUrl={settings.discordUrl} />
              </div>
            )}

            <div className="mt-12 grid animate-fade-in grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
              {[
                { value: scripts.length, label: "Total Scripts", icon: Swords, color: "text-glass-accent-bright" },
                { value: freeCount, label: "Free", icon: Sparkles, color: "text-emerald-400" },
                { value: paidCount, label: "Paid", icon: Sparkles, color: "text-amber-400" },
                { value: categories.length, label: "Categories", icon: Flame, color: "text-white" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-glass-border bg-glass-card/60 px-4 py-3 backdrop-blur-2xl transition-all duration-300 hover:border-glass-accent/30 hover:bg-glass-card hover:shadow-[0_0_30px_-5px] hover:shadow-glass-accent/15">
                  <div className={`flex size-10 items-center justify-center rounded-xl border border-glass-border bg-glass-dark/60 ${stat.color}`}>
                    <stat.icon className="size-4" />
                  </div>
                  <div className="text-left">
                    <p className={`font-display text-xl font-bold leading-none ${stat.color}`}>{stat.value}</p>
                    <p className="mt-0.5 text-xs text-glass-muted">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-accent/30 to-transparent" />
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        <Suspense fallback={<StoreGridSkeleton />}>
          <StoreSwitcher scripts={scripts} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}