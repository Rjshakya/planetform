import {
	Copy,
	Globe,
	Loader2,
	PlusIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useRevalidator } from "react-router";
import { toast } from "sonner";
import { motion } from "motion/react";
import type { IUser } from "@/lib/session";
import type {
	CustomDomain,
} from "@/hooks/use-custom-domain";
import {
	createCustomDomain,
} from "@/hooks/use-custom-domain";
import { toastPromiseOptions } from "@/lib/toast";
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
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	ItemGroup,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { EmptyDomains } from "./empty-domains";
import { CustomDomainItem } from "./custom-domain-item";
import { UpgradeModal } from "@/components/billing/upgrade-modal";
import { useCanUseCustomDomain } from "@/hooks/gates";
import type { WorkspaceWithForms } from "~/hooks/use-workspace";

interface CustomDomainHomeProps {
	user: IUser;
	domains: CustomDomain[];
	workspaces: WorkspaceWithForms;
}

export const CustomDomainHome = ({
	user,
	domains,
	workspaces,
}: CustomDomainHomeProps) => {
	const revalidator = useRevalidator();
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);

	// Check if user can use custom domains
	const { canUse, isLoading: isCheckingDomainAccess } = useCanUseCustomDomain();

	// Form state
	const [selectedFormId, setSelectedFormId] = useState("");
	const [hostname, setHostname] = useState("");

	// Get CNAME value
	const [cname] = useState<string>("customers.planetform.xyz");

	// Flatten forms from all workspaces for the dropdown
	const allForms = useMemo(() => {
		if (!workspaces) return [];
		const forms: { id: string; name: string; workspaceName: string }[] = [];
		workspaces.forEach((workspace) => {
			workspace.forms?.forEach((form) => {
				forms.push({
					id: form.shortId || "",
					name: form.name,
					workspaceName: workspace.name || "Unnamed Workspace",
				});
			});
		});
		return forms;
	}, [workspaces]);

	const handleCopy = useCallback(async (text: string) => {
		await navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard");
	}, []);

	const handleOpenDialog = useCallback(() => {
		// Check if user can use custom domains before opening
		if (!isCheckingDomainAccess && !canUse) {
			setShowUpgradeModal(true);
			return;
		}
		setIsAddDialogOpen(true);
	}, [canUse, isCheckingDomainAccess]);

	const handleCreateDomain = useCallback(async () => {
		if (!selectedFormId || !hostname) {
			toast.error("Please select a form and enter a hostname");
			return;
		}

		// Double-check before creating
		if (!canUse) {
			setShowUpgradeModal(true);
			return;
		}

		setIsCreating(true);
		try {
			await createCustomDomain(
				{ formId: selectedFormId, hostName: hostname },
				user.id,
			);
			setIsAddDialogOpen(false);
			setSelectedFormId("");
			setHostname("");
			revalidator.revalidate();
			toast.success("Custom domain created successfully");
		} catch (error) {
			toast.error("Failed to create custom domain");
		} finally {
			setIsCreating(false);
		}
	}, [selectedFormId, hostname, user.id, revalidator, canUse]);

	return (
		<div className="grid gap-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h3>Custom Domains</h3>
				<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger
						render={
							<Button 
								disabled={isCreating} 
								onClick={handleOpenDialog}
							>
								{isCreating ? (
									<Loader2 className="animate-spin" />
								) : (
									<PlusIcon />
								)}
								<span>{isCreating ? "Creating..." : "Add Domain"}</span>
							</Button>
						}
					/>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Custom Domain</DialogTitle>
							<DialogDescription>
								Connect your own domain to make your forms look more
								professional.
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="form">Select Form</Label>
								<Select
									value={selectedFormId}
									onValueChange={(formId) => setSelectedFormId(formId ?? "")}
								>
									<SelectTrigger id="form">
										<SelectValue>
											{selectedFormId || "select a form"}
										</SelectValue>
									</SelectTrigger>
									<SelectContent className="">
										{allForms.map((form) => (
											<SelectItem className="w-full" key={form.id} value={form.id}>
												{form.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="hostname">Hostname</Label>
								<Input
									id="hostname"
									value={hostname}
									onChange={(e) => setHostname(e.currentTarget.value)}
									placeholder="forms.example.com"
								/>
								<p className="text-xs text-muted-foreground">
									Enter the subdomain or domain you want to use (e.g.,{" "}
									forms.yourdomain.com)
								</p>
							</div>
						</div>

						<DialogFooter>
							<Button
								variant="secondary"
								onClick={() => setIsAddDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={() => {
									toast.promise(
										handleCreateDomain,
										toastPromiseOptions({
											loading: "Creating domain...",
											success: "Domain created successfully",
											error: "Failed to create domain",
										}),
									);
								}}
								disabled={!selectedFormId || !hostname || isCreating}
							>
								{isCreating ? <Loader2 className="animate-spin mr-2" /> : null}
								Create Domain
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* CNAME Instructions Card */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.25, ease: "easeOut" }}
			>
				<Card className="bg-muted">
					<CardHeader>
						<CardTitle className="text-sm flex items-center gap-2">
							<Globe className="size-4" />
							DNS Configuration
						</CardTitle>
						<CardDescription>
							Point your domain&apos;s CNAME record to:
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<code className="bg-background px-3 py-2 rounded-md text-sm flex-1 font-mono">
								{cname}
							</code>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => handleCopy(cname)}
							>
								<Copy className="size-4 mr-1" />
								Copy
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Domain List */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
			>
				<div className="grid bg-muted p-1 rounded-md">
					<h3 className="text-xs py-2 pl-1">Domains</h3>
					<ItemGroup className="bg-card gap-0">
						{domains && domains.length > 0 ? (
							domains.map((domain, i) => (
								<CustomDomainItem
									key={domain.id}
									domain={domain}
									cname={cname}
									userId={user.id}
									className={i !== domains.length - 1 ? "border-b-foreground/20" : ""}
								/>
							))
						) : (
							<EmptyDomains />
						)}
					</ItemGroup>
				</div>
			</motion.div>

			{/* Upgrade Modal for Custom Domain */}
			<UpgradeModal
				isOpen={showUpgradeModal}
				onClose={() => setShowUpgradeModal(false)}
				feature="custom domains"
			/>
		</div>
	);
};
