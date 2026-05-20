import useSWR from "swr";
import { authClient } from "../lib/auth-client";
import { client } from "../lib/hc";

const fetcher = async (url: string) => {
	const res = await fetch(url, {
		credentials: "include",
	});
	if (!res.ok) throw new Error("Failed to fetch");
	return res.json();
};

/**
 * Hook to check if user has an active pro subscription
 */
export const useSubscription = () => {
	const { data, error, isLoading, mutate } = useSWR(
		`${import.meta.env.VITE_BACKEND_URL}/api/billing/is-pro`,
		fetcher,
		{
			refreshInterval: 300000, // Refresh every 5 minutes
			revalidateOnFocus: true,
		},
	);

	return {
		isPro: data?.isPro ?? false,
		isLoading,
		error,
		mutate,
	};
};

/**
 * Hook to get current plan benefits (free or pro)
 */
export const usePlanBenefits = () => {
	const { data, error, isLoading, mutate } = useSWR(
		`${import.meta.env.VITE_BACKEND_URL}/api/billing/benefits`,
		fetcher,
		{
			refreshInterval: 300000, // Refresh every 5 minutes
			revalidateOnFocus: true,
		},
	);

	return {
		benefits: data,
		isLoading,
		error,
		mutate,
	};
};

/**
 * Hook to open Polar Customer Portal
 * Redirects user to Polar's hosted portal
 */
export const useCustomerPortal = () => {
	const openPortal = async () => {
		try {
			await authClient.customer.portal();
		} catch (error) {
			console.error("Failed to open customer portal:", error);
			throw error;
		}
	};

	return { openPortal };
};

/**
 * Hook to initiate checkout for Pro plan
 * Redirects user to Polar checkout
 */
export const useCheckout = () => {
	const checkout = async () => {
		try {
			await authClient.checkout({
				slug: "pro",
			});
		} catch (error) {
			console.error("Failed to initiate checkout:", error);
			throw error;
		}
	};

	return { checkout };
};
