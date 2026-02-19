import { Skeleton } from "@/components/ui/skeleton";

export const AnalyticsSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 pb-8">
      {/* CommonMenu placeholder */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Tabs placeholder */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-4">
        <Skeleton className="h-9 w-28 rounded-sm" />
        <Skeleton className="h-9 w-28 rounded-sm" />
        <Skeleton className="h-9 w-28 rounded-sm" />
        <Skeleton className="h-9 w-28 rounded-sm" />
      </div>

      {/* Interval selector */}
      <div className="mb-4">
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      {/* Analytics cards grid */}
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            {/* Card header */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Chart area placeholder */}
            <div className="bg-accent/80 dark:bg-background border rounded-md p-4">
              <div className="h-40 flex items-end justify-between gap-2 px-4">
                {Array.from({ length: 8 }).map((_, j) => (
                  <Skeleton
                    key={j}
                    className="w-full rounded-sm"
                    style={{
                      height: `${Math.random() * 60 + 20}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
