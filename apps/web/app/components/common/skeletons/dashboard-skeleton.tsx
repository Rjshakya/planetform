import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Stats cards */}
      <div className="grid gap-1 md:grid-cols-2">
        {/* Workspaces card */}
        <div className="p-1 bg-muted rounded-sm">
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="bg-card rounded-sm p-4 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>

        {/* Forms card */}
        <div className="p-1 bg-muted rounded-sm">
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="bg-card rounded-sm p-4 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>

      {/* Workspaces section header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {/* Workspaces list */}
      <div className="space-y-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-sm p-3">
            <Skeleton className="h-5 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
};
