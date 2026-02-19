import { Skeleton } from "@/components/ui/skeleton";

export const SubmissionsSkeleton = () => {
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

      {/* Table skeleton */}
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
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
};
