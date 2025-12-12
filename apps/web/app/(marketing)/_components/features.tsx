import { Badge } from "@/components/ui/badge";
import { Blocks, BarChart3, Palette, Plug } from "lucide-react";

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
    <section id="features" className="w-full px-4">
      <div className="grid gap-32 px-4 bg-foreground py-36 rounded-4xl">
        <div className=" space-y-8  text-background">
          <Badge
            variant="outline"
            className="w-fit text-background bg-foreground"
          >
            Product highlights
          </Badge>
          <h1 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
            Everything you need in one form builder
          </h1>
          <p className="max-w-lg text-left   text-muted-foreground text-balance">
            Planetform gives your team a single canvas to design, launch, and
            analyze form experiences—without wrestling code or rigid templates.
          </p>
        </div>

        <div className="grid md:grid-cols-2  gap-1  ">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={` group relative p-8 rounded-2xl bg-muted/10 text-background hover:border-primary/40 transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                <div className="relative space-y-4">
                  <div className="size-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground ">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
