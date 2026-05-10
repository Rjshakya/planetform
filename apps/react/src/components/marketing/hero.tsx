import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/stores/useFormStore";
import { MarketingContainer, MarketingSection } from "./marketing-layout";

export const Hero = () => {
  const hookForm = useForm();
  const { getHookForm } = useFormStore((s) => s);

  useEffect(() => {
    if (!getHookForm()) {
      useFormStore.setState({ form: hookForm });
    }
  }, [getHookForm, hookForm]);

  return (
    <MarketingSection id="hero" className="relative overflow-hidden">
      {/* Grid background - positioned absolutely to cover entire section */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(100, 100, 100, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 100, 100, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: "54px 54px",
        }}
      />
      <MarketingContainer className="relative z-10 bg-background border py-12">
        <h1 className="landing-heading mb-6 text-balance">
          Make forms your users actually love to fill .
        </h1>

        <p className="landing-sub-heading mb-8 text-pretty font-medium">
          Create stunning, with our powerful notion-like editor. Collect
          submissions, insights, and integrate with your favorite tools—all in
          one place.
        </p>

        <Link to={"/auth"}>
          <Button
            variant="default"
            className={"px-0 pl-2 pr-1 group "}
            size="lg"
          >
            <p>Create your form for free</p>
            <span className="bg-muted-foreground grid place-content-center rounded-sm p-0.5">
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
      </MarketingContainer>
    </MarketingSection>
  );
};
