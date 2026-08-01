import { StoreSwitcher } from "@/components/StoreSwitcher";
import { DiscordButton } from "@/components/DiscordButton";
import { getScriptsData } from "@/lib/scripts";
import { Flame } from "lucide-react";
import { Chip } from "@heroui/react/chip";
import { Card } from "@heroui/react/card";
import { StoreGridSkeleton } from "@/components/LoadingSkeleton";
import { Suspense } from "react";

export const revalidate = 600;

export default async function HomePage() {
  const { scripts, categories, settings } = await getScriptsData();

  const freeCount = scripts.filter((s) => s.pricing === "free").length;
  const paidCount = scripts.filter((s) => s.pricing === "paid").length;

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-12 text-center">
        <div className="mb-4 flex justify-center">
          <Chip
            variant="soft"
            color="accent"
            size="md"
            className="border border-alliance-red/30 bg-alliance-red/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-alliance-red-bright"
          >
            <Flame className="h-3.5 w-3.5" />
            Roblox Scripts
          </Chip>
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

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {[
            { value: scripts.length, label: "Total Scripts", color: "text-alliance-red-bright" },
            { value: freeCount, label: "Free", color: "text-emerald-400" },
            { value: paidCount, label: "Paid", color: "text-amber-400" },
            { value: categories.length, label: "Categories", color: "text-white" },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="min-w-[120px] border border-alliance-border bg-alliance-card/80 backdrop-blur-sm"
            >
              <Card.Content className="px-6 py-3 text-center">
                <p className={`font-display text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-alliance-muted">{stat.label}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-alliance-red/30 to-transparent" />
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        <Suspense fallback={<StoreGridSkeleton />}>
          <StoreSwitcher scripts={scripts} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}