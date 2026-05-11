import { BarChart3, Blocks, Palette, Plug } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MarketingContainer, MarketingSection } from "./marketing-layout";

const features = [
  {
    img: "/commands-2.webp",
    title: "The easiest and simplest form builder",
    description: "A Notion-like editing experience with zero learning curve.",
    icon: Blocks,
  },
  {
    img: "/analytics.webp",
    title: "See how people interact with your forms",
    description:
      "Track visitors, submissions, conversions, and trends in real time.",
    icon: BarChart3,
  },
  {
    img: "/commands-2.webp",
    title: "Customize everything",
    description: "Fine-tune colors, spacing, typography, layouts, and more.",
    icon: Palette,
  },
  {
    img: "/integrations.webp",
    title: "Integrations",
    description:
      "Connect your form with your favorite tools, such as Google Sheets, Notion, custom webhooks, and many more.",
    icon: Plug,
  },
];

export const Features = () => {
  return (
    <MarketingSection id="features" background="foreground">
      <MarketingContainer className="grid gap-8">
        <h1 className="landing-heading mb-6 text-pretty text-primary-foreground">
          Everything you need to build better forms
        </h1>
        <p className="landing-sub-heading text-pretty text-center mx-auto mt-8 text-primary-foreground">
          A powerful editing experience with analytics, integrations, and full
          design control.
        </p>

        <div>{/* <FeatureCardI /> */}</div>

        <div className="grid md:grid-cols-2 gap-4 mt-24">
          {features.map((feature) => {
            return (
              <Card key={feature.title} className="py-2">
                <CardHeader className="px-2">
                  <div className="card-image p-1 bg-input">
                    <img src={feature.img} className="size-full" />
                  </div>

                  <div className="grid gap-2 mt-4 p-4">
                    <CardTitle className="text-2xl font-sans font-normal tracking-[-5%] ">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="font-mono">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
};

/**
 * from Paper
 * https://app.paper.design/file/01KRB4D0W0WE9R60BMECWDAPMM/1-0/3K-0
 * on May 11, 2026
 */
export function FeatureCardI() {
  return (
    <div className="[font-synthesis:none] flex w-176 flex-col items-start gap-7 px-3.5 py-4.5 bg-white antialiased">
      <div className="flex overflow-clip items-center gap-0 h-136.5 justify-center rounded-md self-stretch shrink-0 bg-white p-0">
        <div
          className="w-339.5 h-165 rounded-[15px] shrink-0 bg-cover bg-position-[50%]"
          style={{
            backgroundImage:
              "url(https://app.paper.design/file-assets/01KRB4D0W0WE9R60BMECWDAPMM/01KRBAE9AHEEP1YXZP49PYXK5J.png)",
          }}
        />
      </div>
      <div className="flex overflow-clip flex-col items-start gap-15.25 px-11 py-15.25 self-stretch">
        <div className="tracking-[-0.06em] self-stretch  text-black text-[65px]/16.5">
          The easiest and simplest form builder
        </div>
        <div className="text-[24px] leading-[120%] self-stretch tracking-[-0.01em] font-['Geist_Mono',system-ui,sans-serif] text-black">
          A Notion-like editing experience with zero learning curve.
        </div>
      </div>
    </div>
  );
}
