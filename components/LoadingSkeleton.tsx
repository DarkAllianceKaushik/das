export function CardSkeleton() {
  return (
    <div className="card-surface animate-pulse p-5">
      <div className="mb-3 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-alliance-border/50" />
        <div className="h-5 w-12 rounded-full bg-alliance-border/50" />
      </div>
      <div className="mb-2 h-6 w-3/4 rounded bg-alliance-border/50" />
      <div className="mb-1 h-4 w-full rounded bg-alliance-border/30" />
      <div className="mb-4 h-4 w-2/3 rounded bg-alliance-border/30" />
      <div className="flex gap-1.5">
        <div className="h-5 w-14 rounded-md bg-alliance-border/30" />
        <div className="h-5 w-16 rounded-md bg-alliance-border/30" />
      </div>
    </div>
  );
}

export function StoreGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card-surface animate-pulse px-6 py-3 text-center">
      <div className="mx-auto mb-1 h-8 w-12 rounded bg-alliance-border/50" />
      <div className="mx-auto h-4 w-16 rounded bg-alliance-border/30" />
    </div>
  );
}
