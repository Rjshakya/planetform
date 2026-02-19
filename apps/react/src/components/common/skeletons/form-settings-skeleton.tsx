import { Skeleton } from "@/components/ui/skeleton";

export const FormSettingsSkeleton = () => {
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

      {/* Reset button row */}
      <div className="flex justify-end mb-4">
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      <div className="grid gap-4">
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
    </div>
  );
};
