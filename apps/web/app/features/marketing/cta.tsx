import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { MarketingContainer, MarketingSection } from "./marketing-layout";

export const CTA = () => {
  return (
    <MarketingSection id="cta" className=" ">
      <MarketingContainer className="mb-12 grid gap-8 text-center">
        <h1 className="landing-heading mb-6 text-pretty ">
          Ready to build forms effortlessly?
        </h1>
        <p className="landing-sub-heading  text-center sm:mx-auto mx-2  mt-8  ">
          Join thousands of teams using Planetform to create beautiful, modern
          forms with powerful analytics and seamless integrations.
        </p>

        <div className="cta w-full flex justify-center mt-12">
          <Link to={"/auth"} className="">
            <Button
              variant="default"
              className={"py-5 md:py-5 pr-1 group   rounded-sm gap-4 "}
              size="lg"
            >
              <p>Start for free</p>
              <span className="bg-cta grid place-content-center rounded-xs p-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=" size-5 fill-none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M14.4302 5.92969L20.5002 11.9997L14.4302 18.0697"
                    className=" stroke-primary-foreground"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.5 12H20.33"
                    className=" stroke-primary-foreground"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Button>
          </Link>
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
};
