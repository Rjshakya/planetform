import { BarChart3, Blocks, Palette, Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  MarketingContainer,
  MarketingHeader,
  MarketingSection,
} from "./marketing-layout";

const features = [
  {
    title: "Block-based editor",
    description:
      "Assemble entire experiences with reusable blocks, and inline rich text editing.",
    icon: Blocks,
  },
  {
    title: "Rich Insights",
    description:
      "Not just receive submissions, receive real information about them to really understand your submissions.",
    icon: BarChart3,
  },
  {
    title: "Branded experiences",
    description:
      "Deliver fully responsive, on-brand forms with custom typography, theming, and media embeds.",
    icon: Palette,
  },
  {
    title: "Integrations",
    description:
      "Connect your form with your favorite tools, such as Google Sheets, Notion, custom webhooks, and many more.",
    icon: Plug,
  },
];

export const Features = () => {
  return (
    <MarketingSection id="features" background="foreground">
      <MarketingContainer>
        <MarketingHeader
          badge={
            <Badge variant="secondary" className="font-mono rounded-xs">
              Product highlights
            </Badge>
          }
          title="Everything you need in one form builder"
          description="Planetform gives your team a single canvas to design, launch, and analyze form experiences—without wrestling code or rigid templates."
          className="text-background [&_.landing-sub-heading]:text-background/80"
        />

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <Button size="icon-sm" className="mb-4">
                    <Icon className="size-4" />
                  </Button>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
};
