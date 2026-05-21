"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-billing";
import { Sparkles, X } from "lucide-react";

interface UpgradeModalProps {
	isOpen: boolean;
	onClose: () => void;
	feature: string;
	currentCount?: number;
	maxCount?: number;
}

export function UpgradeModal({
	isOpen,
	onClose,
	feature,
	currentCount,
	maxCount,
}: UpgradeModalProps) {
	const { checkout } = useCheckout();

	const handleUpgrade = async () => {
		try {
			await checkout();
		} catch (error) {
			console.error("Failed to initiate checkout:", error);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-amber-500" />
						<DialogTitle>Upgrade to Pro</DialogTitle>
					</div>
					<DialogDescription className="pt-2">
						{currentCount !== undefined && maxCount !== undefined ? (
							<>
								You&apos;ve reached the limit of <strong>{maxCount}</strong> {feature} on
								the free plan. You currently have {currentCount}.
							</>
							) : (
								<>
									<strong>{feature}</strong> is only available on the Pro plan.
								</>
							)}
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="rounded-lg bg-muted p-4">
						<h4 className="mb-2 text-sm font-medium">Pro plan includes:</h4>
						<ul className="space-y-1 text-xs text-muted-foreground">
							<li className="flex items-center gap-2">
								<span className="text-green-500">✓</span>
								Unlimited workspaces
							</li>
							<li className="flex items-center gap-2">
								<span className="text-green-500">✓</span>
								Unlimited forms per workspace
							</li>
							<li className="flex items-center gap-2">
								<span className="text-green-500">✓</span>
								Custom domains
							</li>
							<li className="flex items-center gap-2">
								<span className="text-green-500">✓</span>
								Advanced analytics
							</li>
							<li className="flex items-center gap-2">
								<span className="text-green-500">✓</span>
								All integrations
							</li>
						</ul>
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={onClose}>
						<X className="mr-2 h-4 w-4" />
						Maybe later
					</Button>
					<Button onClick={handleUpgrade} className="gap-2">
						<Sparkles className="h-4 w-4" />
						Upgrade to Pro
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
