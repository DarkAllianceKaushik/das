import { StoreSwitcher } from "@/components/StoreSwitcher";
import { DiscordButton } from "@/components/DiscordButton";
import { getScriptsData } from "@/lib/scripts";
import { Flame } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { scripts, categories, settings } = await getScriptsData();

  const freeCount = scripts.filter((s) => s.pricing === "free").length;
  const paidCount = scripts.filter((s) => s.pricing === "paid").length;

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-glass-accent/30 bg-glass-accent/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-glass-accent-bright">
          <Flame className="h-3.5 w-3.5" />
          Roblox Scripts
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-white">Dark Alliance</span>
          <br />
          <span className="bg-gradient-to-r from-glass-accent-bright via-glass-accent to-glass-accent-dim bg-clip-text text-transparent">
            Script Store
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-glass-muted sm:text-lg">
          Browse Dark Alliance curated scripts or search live results from
          ScriptBlox and RScripts — all in one place.
        </p>

        {settings.discordUrl && (
          <div className="mt-6 flex justify-center">
            <DiscordButton discordUrl={settings.discordUrl} className="sm:hidden" />
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="card-surface px-6 py-3">
            <p className="font-display text-2xl font-bold text-glass-accent-bright">
              {scripts.length}
            </p>
            <p className="text-xs text-glass-muted">Total Scripts</p>
          </div>
          <div className="card-surface px-6 py-3">
            <p className="font-display text-2xl font-bold text-emerald-400">
              {freeCount}
            </p>
            <p className="text-xs text-glass-muted">Free</p>
          </div>
          <div className="card-surface px-6 py-3">
            <p className="font-display text-2xl font-bold text-amber-400">
              {paidCount}
            </p>
            <p className="text-xs text-glass-muted">Paid</p>
          </div>
          <div className="card-surface px-6 py-3">
            <p className="font-display text-2xl font-bold text-white">
              {categories.length}
            </p>
            <p className="text-xs text-glass-muted">Categories</p>
          </div>
        </div>
      </section>

      <StoreSwitcher scripts={scripts} categories={categories} />
    </div>
  );
}
