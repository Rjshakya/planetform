import { usePlanBenefits } from "../use-billing";

/**
 * Hook to check if user can use custom domains
 * Returns { canUse: boolean, isLoading, isPro }
 */
export const useCanUseCustomDomain = () => {
	const { benefits, isLoading } = usePlanBenefits();

	// If benefits haven't loaded yet, assume they can't use (safe default)
	if (!benefits || isLoading) {
		return {
			canUse: false,
			isLoading: true,
			isPro: false,
		};
	}

	return {
		canUse: benefits.allowCustomDomains,
		isLoading: false,
		isPro: benefits.pro,
	};
};
