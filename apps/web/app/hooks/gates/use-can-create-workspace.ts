import { usePlanBenefits } from "../use-billing";
import { useUserWorkspace } from "../use-workspace";

/**
 * Hook to check if user can create more workspaces
 * Returns { canCreate: boolean, currentCount: number, maxWorkspaces: number, isLoading }
 */
export const useCanCreateWorkspace = (userId: string) => {
	const { benefits, isLoading: benefitsLoading } = usePlanBenefits();
	const { workspaces, workspaceLoading } = useUserWorkspace(userId);

	const currentCount = workspaces?.length ?? 0;
	const maxWorkspaces = benefits?.maxWorkspaces ?? 1;
	const isLoading = benefitsLoading || workspaceLoading;

	// If benefits haven't loaded yet, assume they can't create (safe default)
	if (!benefits || isLoading) {
		return {
			canCreate: false,
			currentCount,
			maxWorkspaces: 1,
			isLoading: true,
			isPro: false,
		};
	}

	const canCreate =
		maxWorkspaces === Infinity || currentCount < maxWorkspaces;

	return {
		canCreate,
		currentCount,
		maxWorkspaces,
		isLoading: false,
		isPro: benefits.pro,
	};
};
