import { Nav } from "../(marketing)/_components/nav";
import { Footer } from "../(marketing)/_components/footer";
import { Badge } from "@/components/ui/badge";
import { Slack, MessageSquare, Code, CheckCircle2, Clock } from "lucide-react";

const upcomingFeatures = [
  {
    title: "Slack Integration",
    icon: Slack,
    status: "upcoming",
    description:
      "Receive form submissions directly in your Slack channels. Configure custom notifications, route submissions to specific channels, and set up automated workflows.",
    timeline: "Q2 2024",
  },
  {
    title: "Discord Integration",
    icon: MessageSquare,
    status: "upcoming",
    description:
      "Connect your forms to Discord servers. Send submissions as messages, create threads for each submission, and integrate with Discord bots for advanced automation.",
    timeline: "Q2 2024",
  },
  {
    title: "Custom Logic Fields",
    icon: Code,
    status: "upcoming",
    description:
      "Build dynamic forms with conditional logic, calculations, and custom validation rules. Create complex workflows that adapt based on user responses.",
    timeline: "Q3 2024",
  },
];

const completedFeatures = [
  {
    title: "Block-based Editor",
    status: "completed",
    description: "Intuitive drag-and-drop form builder with rich text editing.",
  },
  {
    title: "Google Sheets Integration",
    status: "completed",
    description: "Automatically sync form submissions to Google Sheets.",
  },
  {
    title: "Notion Integration",
    status: "completed",
    description: "Connect forms to Notion databases for seamless data flow.",
  },
  {
    title: "Webhook Support",
    status: "completed",
    description: "Send form data to any endpoint with custom webhooks.",
  },
  {
    title: "Advanced Analytics",
    status: "completed",
    description: "Comprehensive insights and analytics dashboard.",
  },
  {
    title: "Custom Branding",
    status: "completed",
    description: "Remove Planetform branding and customize your forms.",
  },
];

export default function RoadmapPage() {
  return (
    <>
      <main className="w-full px-3">
        <div className="max-w-4xl mx-auto grid pt-4 border-x relative">
          <Nav />

          {/* Header Section */}
          <section className="w-full relative overflow-hidden py-36 px-4">
            <div className="space-y-8 py-2">
              <Badge variant="outline" className="w-fit">
                Roadmap
              </Badge>
              <h1 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                {`What's coming next`}
              </h1>
              <p className="max-w-lg text-left text-muted-foreground text-balance">
                {`We're constantly improving Planetform based on your feedback.
                Here's what we're building next and what we've already delivered.`}
              </p>
            </div>
          </section>

          {/* Upcoming Features Section */}
          <section className="w-full py-32 px-4">
            <div className="grid gap-32">
              <div className="space-y-8">
                <Badge variant="outline" className="w-fit">
                  Upcoming
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Features in development
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  These features are currently in development and will be
                  released soon.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                {upcomingFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                      <div className="relative space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="size-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-6" />
                          </div>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Clock className="size-3" />
                            {feature.timeline}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground">
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

          {/* Completed Features Section */}
          <section className="w-full py-32 px-4">
            <div className="grid gap-32">
              <div className="space-y-8">
                <Badge variant="outline" className="w-fit">
                  Completed
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Recently shipped
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  {`Features we've recently released and are now available to all
                  users.`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                {completedFeatures.map((feature, i) => (
                  <div
                    key={feature.title}
                    className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    <div className="relative space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-primary" />
                        <h3 className="text-xl font-semibold">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-32 px-4">
            <div className=" px-4 bg-foreground py-36 rounded-4xl flex items-center justify-center">
              <div className="space-y-8 text-background">
                <Badge
                  variant="outline"
                  className="w-fit text-background bg-foreground"
                >
                  Feedback
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Have a feature request?
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  {`  We'd love to hear your ideas! Your feedback helps us prioritize
                  what to build next. Reach out to us with your suggestions.`}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
