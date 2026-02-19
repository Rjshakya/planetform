import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MarketingContainer,
  MarketingHeader,
  MarketingSection,
} from "./marketing-layout";

export const CTA = () => {
  return (
    <MarketingSection border>
      <MarketingContainer>
        <MarketingHeader
          className=""
          title={
            <>
              <span className="bg-primary text-primary-foreground inline-block mb-1 px-2 py-1">
                Ready to build
              </span>
              <br />
              <span className="bg-primary text-primary-foreground inline-block px-2 py-1">
                forms effortlessly?
              </span>
            </>
          }
          description="Join thousands of teams using Planetform to create beautiful, modern forms with powerful analytics and seamless integrations."
          align="left"
        />

        <div className="flex items-center justify-start gap-4">
          <Link to={"/auth"}>
            <Button variant="secondary" size="lg">
              Start for free
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
};
