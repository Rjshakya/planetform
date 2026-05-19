import { Skeleton } from "@/components/ui/skeleton";

export const AnalyticsSkeleton = () => {
  return (
    <div className="grid gap-4">
      {/* Interval selector */}
      <div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      {/* Analytics cards grid */}
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
  );
};
