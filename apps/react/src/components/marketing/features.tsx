import { Badge } from "@/components/ui/badge";
import { Blocks, BarChart3, Palette, Plug } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

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
    <section id="features" className="w-full ">
      <div className="grid px-2 md:px-20 bg-foreground  ">
        <div className="h-50 w-full" />
        <div className="text-background space-y-8 px-1">
          <Badge>Product highlights</Badge>
          <h1 className="landing-heading text-balance">
            Everything you need in one form builder
          </h1>
          <p className="landing-sub-heading text-balance">
            Planetform gives your team a single canvas to design, launch, and
            analyze form experiences—without wrestling code or rigid templates.
          </p>
        </div>
         <div className="h-36 w-full" />

        <div className="grid md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <Button size={"icon-sm"} className={"mb-4"}>
                    <Icon className="size-4" />
                  </Button>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
        <div className="h-50 w-full" />
      </div>
    </section>
  );
};
