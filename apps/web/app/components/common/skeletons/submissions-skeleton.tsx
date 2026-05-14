import { Skeleton } from "@/components/ui/skeleton";

export const SubmissionsSkeleton = () => {
  return (
    <div className="border rounded-md overflow-hidden">
      {/* Table header */}
      <div className="bg-muted border-b p-3 flex gap-3">
        <Skeleton className="h-5 w-5 rounded-sm flex-shrink-0" />
        <Skeleton className="h-5 w-32 rounded-sm" />
        <Skeleton className="h-5 w-40 rounded-sm" />
        <Skeleton className="h-5 w-36 rounded-sm" />
        <Skeleton className="h-5 w-28 rounded-sm" />
      </div>

      {/* Table rows */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="border-b last:border-b-0 p-3 flex gap-3 items-center"
        >
          <Skeleton className="h-4 w-4 rounded-sm flex-shrink-0" />
          <Skeleton className="h-4 w-28 rounded-sm" />
          <Skeleton className="h-4 w-36 rounded-sm" />
          <Skeleton className="h-4 w-32 rounded-sm" />
          <Skeleton className="h-4 w-24 rounded-sm" />
        </div>
      ))}

      {/* Pagination footer */}
      <div className="flex items-center justify-between p-3">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
};
