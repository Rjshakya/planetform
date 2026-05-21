import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useCheckout } from "@/hooks/use-billing";

const plans = [
  {
    name: "Free",
    price: "Free",
    period: "forever",
    description: "Everything you need to get started with beautiful forms.",
    features: [
      { label: "1 workspace", included: true },
      { label: "10 forms per workspace", included: true },
      { label: "Unlimited responses", included: true },
      { label: "Basic analytics", included: true },
      { label: "Basic Integrations", included: true },
      { label: "Custom domains", included: false },
      { label: "Advanced analytics", included: false },
    ],
    cta: "Start for free",
    ctaLink: "/auth",
    variant: "secondary" as const,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/ month",
    description: "Unlock unlimited power for your forms and workflows.",
    features: [
      { label: "Unlimited workspaces", included: true },
      { label: "Unlimited forms", included: true },
      { label: "Unlimited responses", included: true },
      { label: "Custom domains", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Pro Integrations", included: true },
    ],
    cta: "Upgrade to Pro",
    ctaAction: true,
    variant: "default" as const,
  },
];

export const PricingHome = () => {
  const { checkout } = useCheckout();

  return (
    <div className="grid gap-16 pt-12 pb-40 px-4 min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Start free and upgrade when you need more power. No hidden fees,
          no surprises.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full px-4">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <Badge
                  variant={
                    plan.name === "Pro" ? "default" : "secondary"
                  }
                  className={`${plan.name === "Pro" ? "bg-cta text-white" : ""}`}
                >

                  {plan.name}
                </Badge>
              </div>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-2">
                <span className="text-3xl font-bold">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  {plan.period}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-center gap-2"
                  >
                    {feature.included ? (
                      <Check className="size-4 text-green-500 shrink-0" />
                    ) : (
                      <X className="size-4 text-muted-foreground/50 shrink-0" />
                    )}
                    <span
                      className={
                        feature.included
                          ? "text-sm"
                          : "text-sm text-muted-foreground"
                      }
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                {plan.ctaAction ? (
                  <Button
                    size={"lg"}
                    className="w-full"
                    onClick={() => checkout()}
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  <Link to={plan.ctaLink ?? "/"} className="block">
                    <Button
                      size={"lg"}
                      variant="outline"
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
