import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRevalidator } from "react-router";
import { toast } from "sonner";
import {
	CreditCard,
	Check,
	X,
	Sparkles,
	CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useCustomerPortal, useCheckout } from "@/hooks/use-billing";
import type { IUser } from "@/lib/session";

interface BillingHomeProps {
	user: IUser;
	benefits: {
		plan: string;
		pro: boolean;
		maxWorkspaces: number;
		maxFormsPerWorkspace: number;
		maxResponsesPerMonth: number;
		allowCustomDomains: boolean;
		allowAdvancedAnalytics: boolean;
		allowIntegrations: boolean;
	} | null;
	isPro: boolean;
}

export const BillingHome = ({
	benefits,
	isPro,
}: BillingHomeProps) => {
	const { openPortal } = useCustomerPortal();
	const { checkout } = useCheckout();
	const [searchParams, setSearchParams] = useSearchParams();
	const revalidator = useRevalidator();

	const isSuccess = searchParams.get("success") === "true";
	const [showSuccessModal, setShowSuccessModal] = useState(isSuccess);

	useEffect(() => {
		if (isSuccess) {
			revalidator.revalidate();
		}
	}, [isSuccess, revalidator]);

	const handleCloseSuccess = useCallback(() => {
		setShowSuccessModal(false);
		setSearchParams({});
	}, [setSearchParams]);

	const handleManageBilling = useCallback(async () => {
		try {
			await openPortal();
		} catch {
			toast.error("Failed to open billing portal");
		}
	}, [openPortal]);

	const handleUpgrade = useCallback(async () => {
		try {
			await checkout();
		} catch {
			toast.error("Failed to initiate checkout");
		}
	}, [checkout]);

	const features = [
		{
			label: "Workspaces",
			value:
				benefits?.maxWorkspaces === 9999
					? "Unlimited"
					: benefits?.maxWorkspaces ?? 1,
		},
		{
			label: "Forms per workspace",
			value:
				benefits?.maxFormsPerWorkspace === 9999
					? "Unlimited"
					: benefits?.maxFormsPerWorkspace ?? 10,
		},
		{
			label: "Custom domains",
			included: benefits?.allowCustomDomains ?? false,
		},
		{
			label: "Advanced analytics",
			included: benefits?.allowAdvancedAnalytics ?? false,
		},
		{
			label: "Integrations",
			included: benefits?.allowIntegrations ?? false,
		},
	];

	return (
		<div className="grid gap-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Billing</h2>
			</div>

			{/* Current Plan Card */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg">
								<CreditCard className="size-5 text-primary" />
							</div>
							<div>
								<CardTitle className="text-base">
									Current Plan
								</CardTitle>
								<CardDescription>
									Your subscription and plan details
								</CardDescription>
							</div>
						</div>
						<Badge
							variant={isPro ? "default" : "secondary"}
							className="capitalize"
						>
							{isPro ? (
								<span className="flex items-center gap-1">
									<Sparkles className="size-3" />
									Pro
								</span>
								) : (
									"Free"
								)}
							</Badge>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Feature list */}
					<div className="space-y-3">
						<h4 className="text-sm font-medium text-muted-foreground">
							Plan features
						</h4>
						<div className="grid gap-2">
							{features.map((feature) => (
								<div
									key={feature.label}
									className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
								>
									<span className="text-sm">
										{feature.label}
									</span>
									{typeof feature.value !== "undefined" ? (
										<span className="text-sm font-medium">
											{feature.value}
										</span>
									) : (
										<span className="flex items-center gap-1.5">
											{feature.included ? (
												<>
													<Check className="size-4 text-green-500" />
													<span className="text-sm text-muted-foreground">
														Included
													</span>
												</>
											) : (
												<>
													<X className="size-4 text-muted-foreground/50" />
													<span className="text-sm text-muted-foreground">
														Not included
													</span>
												</>
											)}
										</span>
									)}
								</div>
							))}
						</div>
					</div>

					{/* CTA */}
					{isPro ? (
						<Button
							onClick={handleManageBilling}
							className="w-full sm:w-auto"
						>
							<CreditCard className="size-4 mr-2" />
							Manage Billing
						</Button>
					) : (
						<Button
							onClick={handleUpgrade}
							className="w-full sm:w-auto"
						>
							<Sparkles className="size-4 mr-2" />
							Upgrade to Pro
						</Button>
					)}
				</CardContent>
			</Card>

			{/* Success Modal */}
			<Dialog
				open={showSuccessModal}
				onOpenChange={(open) => {
					if (!open) handleCloseSuccess();
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<CheckCircle2 className="size-5 text-green-500" />
							Payment Successful
						</DialogTitle>
						<DialogDescription>
							Welcome to Planetform Pro! You now have access to
							unlimited workspaces, unlimited forms, custom domains, and
							all integrations.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end">
						<Button onClick={handleCloseSuccess}>Continue</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
