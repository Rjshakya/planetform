import { Skeleton } from "@/components/ui/skeleton";

export function CustomDomainSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="p-4 bg-muted rounded-md">
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
