import type { Route } from "./+types/page";
import { requireAuth } from "@/lib/session";
import { getIsPro, getPlanBenefits } from "@/hooks/use-billing";
import { BillingHome } from "./home";
import { BillingSkeleton } from "@/components/common/skeletons";

export async function clientLoader() {
	const user = await requireAuth();
	const [benefits, isPro] = await Promise.all([
		getPlanBenefits(),
		getIsPro(),
	]);
	return { user, benefits, isPro };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
	return <BillingSkeleton />;
}

export default function BillingPage({ loaderData }: Route.ComponentProps) {
	return (
		<BillingHome
			user={loaderData.user}
			benefits={loaderData.benefits}
			isPro={loaderData.isPro?.isPro ?? false}
		/>
	);
}
