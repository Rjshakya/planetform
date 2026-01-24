import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

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
    <section id="testimonials" className="w-full">
      <div className="grid px-2 md:px-20">
         <div className="h-50 w-full" />
        <div className="space-y-8 ">
          <Badge>Testimonials</Badge>
          <h1 className="landing-heading text-balance">
            Loved by teams building better forms
          </h1>
          <p className="landing-sub-heading text-balance">
            See what teams are saying about Planetform and how it's helping them
            create better form experiences.
          </p>
        </div>

         <div className="h-36 w-full" />

        <div className="grid md:grid-cols-2  ">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="">

              <CardHeader>
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="size-4 fill-primary text-primary"
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground  ">
                {testimonial.content}
              </CardContent>
              <CardFooter className="grid">
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-xs text-muted-foreground">
                  {testimonial.role}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
         <div className="h-50 w-full" />
      </div>
    </section>
  );
};
