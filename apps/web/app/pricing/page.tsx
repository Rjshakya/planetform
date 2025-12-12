"use client";

import { Nav } from "../(marketing)/_components/nav";
import { Footer } from "../(marketing)/_components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/hooks/use-subscriptions";
import { Check, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const { plans, loadingPlans } = usePlans();

  return (
    <>
      <main className="w-full px-3">
        <div className="max-w-4xl mx-auto grid pt-4 border-x relative">
          <Nav />

          {/* Header Section */}
          <section className="w-full relative overflow-hidden py-36 px-4">
            <div className="space-y-8 py-2">
              <Badge variant="outline" className="w-fit">
                Pricing
              </Badge>
              <h1 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                Simple, transparent pricing
              </h1>
              <p className="max-w-lg text-left text-muted-foreground text-balance">
                Choose the plan that works best for you. All plans include
                unlimited forms, submissions, and insights.
                You must adhere to our <Link href="/fair-use" className=" underline font-semibold">fair use policy</Link>
              </p>
            </div>
          </section>

          {/* Pricing Cards Section */}
          <section className="w-full pb-32 px-4">
            <div className="grid md:grid-cols-2 gap-2">
              {/* Free Plan */}
              <div className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                <div className="relative space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Free</h3>
                      <Badge variant="outline">Month</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Perfect for getting started
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">per month</span>
                  </div>

                  <ul className="space-y-3 pt-4">
                    <li className="flex items-start gap-2">
                      <Check className="size-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Unlimited forms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Unlimited submissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Simple analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Planetform branding</span>
                    </li>
                  </ul>

                  <div className="pt-4">
                    <Link href="/auth">
                      <Button variant="outline" className="w-full" size="lg">
                        Get Started
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Paid Plans */}
              {loadingPlans ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : plans && plans.length > 0 ? (
                plans.map((plan, index) => {
                  const price = parseInt(plan.price_detail?.price || "0") / 100;
                  const currency = "$";
                  const interval =
                    plan.price_detail?.payment_frequency_interval || "month";
                  const isPopular = index === 0; // Mark first paid plan as popular

                  return (
                    <div
                      key={plan.product_id}
                      className={`group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300 ${
                        isPopular ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                      <div className="relative space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <Badge variant="outline">{interval}</Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {plan.description}
                          </p>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">
                            {currency}
                            {price}
                          </span>
                          <span className="text-muted-foreground">
                            per {interval}
                          </span>
                        </div>

                        <ul className="space-y-3 pt-4">
                          <li className="flex items-start gap-2">
                            <Check className="size-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">Unlimited forms</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="size-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">
                              Unlimited submissions
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="size-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">Advanced analytics</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="size-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">
                              No Planetform branding
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="size-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">Custom integrations</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="size-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">Priority support</span>
                          </li>
                        </ul>

                        <div className="pt-4">
                          <Link href="/auth">
                            <Button
                              className="w-full"
                              variant={isPopular ? "default" : "outline"}
                              size="lg"
                            >
                              Get Started
                              <ArrowRight className="ml-2 size-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-24 px-4">
                  <p className="text-muted-foreground">
                    No plans available at the moment. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full py-32 px-4">
            <div className="grid gap-32">
              <div className="space-y-8">
                <Badge variant="outline" className="w-fit">
                  FAQ
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Frequently asked questions
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  Everything you need to know about our pricing and plans.
                </p>
              </div>

              <div className="grid gap-2">
                <div className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="relative space-y-2">
                    <h3 className="text-xl font-semibold">
                      Can I change plans later?
                    </h3>
                    <p className="text-muted-foreground">
                      Yes, you can upgrade or downgrade your plan at any time.
                      Changes will be reflected in your next billing cycle.
                    </p>
                  </div>
                </div>

                <div className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="relative space-y-2">
                    <h3 className="text-xl font-semibold">
                      What payment methods do you accept?
                    </h3>
                    <p className="text-muted-foreground">
                      We accept all major credit cards and debit cards. All
                      payments are processed securely.
                    </p>
                  </div>
                </div>

                <div className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="relative space-y-2">
                    <h3 className="text-xl font-semibold">
                      Is there a free trial?
                    </h3>
                    <p className="text-muted-foreground">
                      Most plans include a free trial period. Check the plan
                      details above for specific trial information.
                    </p>
                  </div>
                </div>

                <div className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="relative space-y-2">
                    <h3 className="text-xl font-semibold">
                      Do you offer refunds?
                    </h3>
                    <p className="text-muted-foreground">
                      {`We offer a 30-day money-back guarantee. If you're not
                      satisfied, contact us within 30 days for a full refund.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* cta */}

          <section className="w-full py-32 px-4">
            <div className="flex items-center justify-center gap-32 px-4 bg-foreground py-36 rounded-4xl">
              <div className="grid gap-12">
                <div className="space-y-8 text-background text-center">
                  <div className="size-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary"></div>
                  <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                    Ready to build forms effortlessly?
                  </h2>
                  <p className="max-w-lg text-left text-muted-foreground text-balance">
                    Join thousands of teams using Planetform to create
                    beautiful, modern forms with powerful analytics and seamless
                    integrations.
                  </p>
                </div>
                <div className="flex  items-center  gap-4">
                  <Link href="/auth">
                    <Button size="lg" className=" ">
                      Start for free
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
