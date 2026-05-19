import { Skeleton } from "@/components/ui/skeleton";

export const EmbedSkeleton = () => {
  return (
    <div className="grid gap-4">
      {/* Direct Link Card */}
      <div className="border rounded-lg p-4 space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>

      {/* iframe Embed Card */}
      <div className="border rounded-lg p-4 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-56" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
        <Skeleton className="h-32 w-full rounded-md" />
      </div>

      {/* Live Preview Card */}
      <div className="border rounded-lg p-4 space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    </div>
  );
};
