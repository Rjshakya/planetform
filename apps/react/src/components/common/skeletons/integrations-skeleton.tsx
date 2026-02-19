import { Skeleton } from "@/components/ui/skeleton";

export const IntegrationsSkeleton = () => {
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

      {/* Connections card (conditional in real UI, showing skeleton version) */}
      <div className="border rounded-lg p-4 mb-4">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-48 mb-4" />
        <div className="space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>

      {/* Integration cards grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            {/* Icon placeholder */}
            <Skeleton className="h-6 w-6 rounded-md" />

            {/* Title */}
            <Skeleton className="h-5 w-32" />

            {/* Description */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
};
