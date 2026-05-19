import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const BodySkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col space-y-3 max-w-3xl mx-auto",
        className,
      )}
    >
      <Skeleton className="h-[150px] w-full " />
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <div className="w-full pr-12">
          <Skeleton className="h-12 w-full " />
        </div>
      </div>
    </div>
  );
};
