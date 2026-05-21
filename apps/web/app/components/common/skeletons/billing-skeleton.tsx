import { Skeleton } from "@/components/ui/skeleton";

export const BillingSkeleton = () => {
	return (
		<div className="grid gap-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-7 w-32" />
			</div>

			{/* Plan card */}
			<div className="bg-muted rounded-md p-1">
				<div className="bg-card rounded-sm p-6 space-y-4">
					<div className="flex items-center gap-3">
						<Skeleton className="h-6 w-24" />
						<Skeleton className="h-5 w-16" />
					</div>
					<Skeleton className="h-4 w-3/4" />
					<div className="space-y-2 pt-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-4/6" />
					</div>
					<Skeleton className="h-9 w-32 rounded-md" />
				</div>
			</div>
		</div>
	);
};
