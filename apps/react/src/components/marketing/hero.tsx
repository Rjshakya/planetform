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
    <MarketingSection
      id="hero"
      className="relative overflow-hidden py-0 md:py-0"
    >
      <div className="bg-[url(/hero-bg.png)] bg-cover py-24">
        <MarketingContainer className="relative z-10  py-12 grid gap-8 ">
          <h1 className="landing-heading mb-6 text-balance ">
            Make forms your users actually love to fill .
          </h1>

          <div className="cta w-full flex justify-center">
            <Link to={"/auth"} className="">
              <Button
                variant="default"
                className={"py-5 md:py-5 pr-1 group bg-black rounded-sm gap-4 "}
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

          <div className="bg-input ring-2 ring-ring/60 drop-shadow-md relative hero-img md:p-40 sm:p-28 p-20 pt-24 md:h-150 sm:h-100 h-62 overflow-hidden rounded-2xl md:mt-28 mt-12">
            <img
              src="/hero.png"
              className="rounded-sm ring ring-ring/20 scale-150  sm:scale-125"
            />
          </div>
        </MarketingContainer>
      </div>
    </MarketingSection>
  );
};
