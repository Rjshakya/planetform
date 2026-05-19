import { Skeleton } from "@/components/ui/skeleton";

export const FormSkeleton = () => {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Title skeleton */}
        <Skeleton className="h-10 w-3/4 mx-auto" />

        {/* Content area skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/5" />
        </div>

        {/* Input skeleton */}
        <Skeleton className="h-12 w-full rounded-md" />

        {/* Button skeleton */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
};
