import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="w-full py-32 min-h-dvh border-t flex items-center justify-start">
      <div className="grid gap-8 max-w-4xl mx-auto w-full">
        {/* <div className="h-50 w-full" /> */}
        <div className="text-center space-y-8">
          <h2 className="landing-heading text-balance">
            <p className="bg-primary text-primary-foreground w-fit mb-1 px-1">
              Ready to build
            </p>
            <p className="bg-primary text-primary-foreground w-fit px-1">
              forms effortlessly?
            </p>
          </h2>
          <p className="landing-sub-heading text-pretty">
            Join thousands of teams using Planetform to create beautiful, modern
            forms with powerful analytics and seamless integrations.
          </p>
        </div>
        <div className="flex  items-center  gap-4">
          <Link to={"/auth"}>
            <Button variant={"secondary"} size="lg" className=" ">
              Start for free
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        {/* <div className="h-50 w-full" /> */}
      </div>
    </section>
  );
};
