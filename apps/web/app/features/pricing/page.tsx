import type { Route } from "./+types/page";
import { Nav } from "@/features/marketing/nav";
import { Footer } from "@/features/marketing/footer";
import { PricingHome } from "./home";

export const meta: Route.MetaFunction = () => {
	return [
		{ title: "Pricing - Planetform" },
		{
			name: "description",
			content:
				"Simple, transparent pricing for Planetform. Start free and upgrade to Pro for $9/month.",
		},
	];
};

export default function PricingPage() {
	return (
		<main className="w-full">
			<div className="relative z-10 bg-background">
				<Nav />
				<div className="pt-16">
					<PricingHome />
				</div>
			</div>
			<Footer />
		</main>
	);
}
