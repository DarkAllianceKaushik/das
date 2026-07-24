import { StoreSwitcher } from "@/components/StoreSwitcher";
import { DiscordButton } from "@/components/DiscordButton";
import { getScriptsData } from "@/lib/scripts";
import { FadeIn, ScaleIn, StaggerContainer, staggerItem } from "@/components/AnimationWrapper";
import { Flame } from "lucide-react";
import { StoreGridSkeleton, StatCardSkeleton } from "@/components/LoadingSkeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { scripts, categories, settings } = await getScriptsData();

  const freeCount = scripts.filter((s) => s.pricing === "free").length;
  const paidCount = scripts.filter((s) => s.pricing === "paid").length;

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <FadeIn>
        <section className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-alliance-red/30 bg-alliance-red/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-alliance-red-bright">
            <Flame className="h-3.5 w-3.5" />
            Roblox Scripts
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-white">Dark Alliance</span>
            <br />
            <span className="text-gradient">
              Script Store
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-alliance-muted sm:text-lg">
            Browse Dark Alliance curated scripts or search live results from
            ScriptBlox and RScripts — all in one place.
          </p>

          {settings.discordUrl && (
            <div className="mt-6 flex justify-center">
              <DiscordButton discordUrl={settings.discordUrl} className="sm:hidden" />
            </div>
          )}

          <StaggerContainer className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { value: scripts.length, label: "Total Scripts", color: "text-alliance-red-bright" },
              { value: freeCount, label: "Free", color: "text-emerald-400" },
              { value: paidCount, label: "Paid", color: "text-amber-400" },
              { value: categories.length, label: "Categories", color: "text-white" },
            ].map((stat) => (
              <ScaleIn key={stat.label}>
                <div className="card-surface px-6 py-3 text-center min-w-[120px]">
                  <p className={`font-display text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-alliance-muted">{stat.label}</p>
                </div>
              </ScaleIn>
            ))}
          </StaggerContainer>
        </section>
      </FadeIn>

      <Suspense fallback={<StoreGridSkeleton />}>
        <StoreSwitcher scripts={scripts} categories={categories} />
      </Suspense>
    </div>
  );
}
