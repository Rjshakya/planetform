import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="w-full py-32 bg-linear-to-br from-primary/10 via-background to-primary/5 min-h-screen flex items-center justify-center">
      <div className="grid gap-12 px-4">
        <div className="text-center space-y-8">
          <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
            Ready to build forms effortlessly?
          </h2>
          <p className="max-w-lg text-left   text-muted-foreground text-balance">
            Join thousands of teams using Planetform to create beautiful, modern
            forms with powerful analytics and seamless integrations.
          </p>
          
        </div>
        <div className="flex  items-center  gap-4">
            <Link href="/auth">
              <Button size="lg" className=" " >
                Start for free
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="" >
                View Pricing
              </Button>
            </Link>
          </div>
      </div>
    </section>
  );
};
