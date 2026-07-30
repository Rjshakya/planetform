import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/stores/useFormStore";
import { MarketingContainer, MarketingSection } from "./marketing-layout";
import { HeroFormShowcase } from "./hero-form-showcase";
import { Card, CardContent } from "@/components/ui/card";

export const Hero = () => {
  const hookForm = useForm();
  const { getHookForm } = useFormStore((s) => s);

  useEffect(() => {
    if (!getHookForm()) {
      useFormStore.setState({ form: hookForm });
    }
  }, [getHookForm, hookForm]);

  return (
    <MarketingSection id="hero" className="relative overflow-hidden py-0 md:py-0">
      <div className=" bg-cover py-24">
        <MarketingContainer className="relative z-10  py-12 grid gap-8 ">
          <h1 className="landing-heading mb-6 text-balance ">
            Get form responses in your inbox, Slack, Notion, and more
          </h1>

          <div className="cta w-full flex justify-center">
            <Link to={"/auth"} className="">
              <Button className={"px-7 py-5"}>
                <p> Start for free</p>
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
              </Button>
            </Link>
          </div>

          <Card className="bg-[url(/bg-img2.png)] bg-cover mt-16 bg-muted dark:bg-card ">
            <CardContent className="">
              <div className=" drop-shadow-lg bg-background rounded-2xl p-6 sm:p-24">
                <HeroFormShowcase />
              </div>
            </CardContent>
          </Card>
        </MarketingContainer>
      </div>
    </MarketingSection>
  );
};
