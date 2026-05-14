import { Skeleton } from "@/components/ui/skeleton";

export const FormSettingsSkeleton = () => {
  return (
    <div className="grid gap-4">
      {/* Reset button row */}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {/* Close Settings Card */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-28" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-10 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>

      {/* Password Settings Card */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-36" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-10 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
        <div className="bg-background rounded-sm p-4 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Delete Form Card */}
      <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  );
};
