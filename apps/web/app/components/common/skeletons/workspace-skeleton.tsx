import { Skeleton } from "@/components/ui/skeleton";

export const WorkspaceSkeleton = () => {
  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <Skeleton className="h-9 w-20 rounded-sm" />
        <Skeleton className="h-9 w-24 rounded-sm" />
      </div>

      {/* Forms section */}
      <div className="bg-muted p-1 rounded-md">
        <Skeleton className="h-4 w-16 mb-2 ml-1" />
        <div className="bg-card space-y-0">
          {/* Form items */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border-b last:border-b-0"
            >
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
