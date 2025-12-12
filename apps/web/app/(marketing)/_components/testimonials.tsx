import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

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
    <section id="testimonials" className="w-full py-32">
      <div className="grid gap-32 px-4">
        <div className="space-y-8 ">
          <Badge variant="outline" className="w-fit">
            Testimonials
          </Badge>
          <h1 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
            Loved by teams building better forms
          </h1>
          <p className="max-w-lg text-left   text-muted-foreground text-balance">
            {` See what teams are saying about Planetform and how it's helping them
            create better form experiences.`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-lg  bg-muted hover:border-primary/40 transition-all duration-300 "
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="size-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground  ">{testimonial.content}</p>
                <div className="space-y-1 pt-2 border-t">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
