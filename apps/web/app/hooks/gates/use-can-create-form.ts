import { usePlanBenefits } from "../use-billing";
import { useWorkspace } from "../use-workspace";

/**
 * Hook to check if user can create more forms in a workspace
 * Returns { canCreate: boolean, currentCount: number, maxForms: number, isLoading }
 */
export const useCanCreateForm = (workspaceId: string) => {
	const { benefits, isLoading: benefitsLoading } = usePlanBenefits();
	const { workspace, workspaceLoading } = useWorkspace(workspaceId);

	const currentCount = workspace?.forms?.length ?? 0;
	const maxForms = benefits?.maxFormsPerWorkspace ?? 10;
	const isLoading = benefitsLoading || workspaceLoading;

	// If benefits haven't loaded yet, assume they can't create (safe default)
	if (!benefits || isLoading) {
		return {
			canCreate: false,
			currentCount,
			maxForms: 10,
			isLoading: true,
			isPro: false,
		};
	}

	const canCreate = maxForms === Infinity || currentCount < maxForms;

	return {
		canCreate,
		currentCount,
		maxForms,
		isLoading: false,
		isPro: benefits.pro,
	};
};
