import { StoreClient } from "@/components/StoreClient";
import { getScriptsData } from "@/lib/scripts";
import { Flame } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { scripts, categories } = await getScriptsData();

  const freeCount = scripts.filter((s) => s.pricing === "free").length;
  const paidCount = scripts.filter((s) => s.pricing === "paid").length;

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-alliance-red/30 bg-alliance-red/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-alliance-red-bright">
          <Flame className="h-3.5 w-3.5" />
          Roblox Scripts
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-white">Dark Alliance</span>
          <br />
          <span className="bg-gradient-to-r from-alliance-red-bright via-alliance-red to-alliance-crimson bg-clip-text text-transparent">
            Script Store
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-alliance-muted sm:text-lg">
          Browse premium and free Roblox scripts. Each listing shows what it
          does — grab the script via Pastebin, Linkvertise, or your link of
          choice.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="card-surface px-6 py-3">
            <p className="font-display text-2xl font-bold text-alliance-red-bright">
              {scripts.length}
            </p>
            <p className="text-xs text-alliance-muted">Total Scripts</p>
          </div>
          <div className="card-surface px-6 py-3">
            <p className="font-display text-2xl font-bold text-emerald-400">
              {freeCount}
            </p>
            <p className="text-xs text-alliance-muted">Free</p>
          </div>
          <div className="card-surface px-6 py-3">
            <p className="font-display text-2xl font-bold text-amber-400">
              {paidCount}
            </p>
            <p className="text-xs text-alliance-muted">Paid</p>
          </div>
          <div className="card-surface px-6 py-3">
            <p className="font-display text-2xl font-bold text-white">
              {categories.length}
            </p>
            <p className="text-xs text-alliance-muted">Categories</p>
          </div>
        </div>
      </section>

      <StoreClient scripts={scripts} categories={categories} />
    </div>
  );
}
