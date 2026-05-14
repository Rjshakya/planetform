import { Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MarketingContainer, MarketingSection } from "./marketing-layout";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager, TechCorp",
    content:
      "Planetform transformed how we collect user feedback. The block-based editor makes it so easy to create beautiful forms that actually get responses.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Founder, StartupXYZ",
    content:
      "The analytics and insights are incredible. We finally understand where users drop off and can optimize our forms in real-time.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Marketing Director, GrowthCo",
    content:
      "The integrations are seamless. Connecting to our CRM and automation tools was a breeze. This is the form builder we've been waiting for.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Operations Lead, ScaleUp",
    content:
      "Unlimited forms and submissions at this price point? It's a no-brainer. We've replaced three different tools with Planetform.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <MarketingSection id="testimonials" >
      <MarketingContainer className="mb-12 grid gap-8 text-center">

        <h1 className="landing-heading mb-6 text-pretty ">
          Loved by teams building better forms
        </h1>
        <p className="landing-sub-heading  text-center sm:mx-auto mx-2 w mt-8  ">
          See what teams are saying about Planetform and how it's helping them
          create better form experiences.
        </p>

        <div className="grid md:grid-cols-2 gap-4 md:mt-28 mt-12">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="py-2 rounded-none">
              <CardContent className="px-4 flex-1">
                <div className="grid gap-2 p-4">
                  <p className="landing-sub-heading  text-center sm:mx-auto mx-2 w mt-8 ">
                    "{testimonial.content}"
                  </p>
                </div>
              </CardContent>
              <CardFooter className="grid px-6 pb-6">
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-xs text-muted-foreground">
                  {testimonial.role}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
};
