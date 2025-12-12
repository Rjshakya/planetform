import { Nav } from "../(marketing)/_components/nav";
import { Footer } from "../(marketing)/_components/footer";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  Database,
  Users,
  AlertCircle,
  MailIcon,
} from "lucide-react";

const limits = [
  {
    title: "Form Submissions",
    icon: Database,
    description:
      "Free users are limited to 30k submissions per month across all forms.",
    limit: "30k submissions/month",
  },
  {
    title: "File Uploads",
    icon: Upload,
    description:
      "Total file storage is limited to 15 GB. Individual file size cannot exceed 5 MB.",
    limit: "15 GB , 5 MB/file",
  },
  {
    title: "Workspace",
    icon: FileText,
    description:
      "You can create and maintain up to 1 workspace at any given time.",
    limit: "1 workspace",
  },
];

const policies = [
  {
    title: "Usage Monitoring",
    description:
      "We monitor usage patterns to ensure fair access for all users. Excessive usage that impacts system performance may result in temporary restrictions.",
  },
  {
    title: "Abuse Prevention",
    description:
      "Any attempt to circumvent limits, abuse the service, or use automated tools to artificially inflate usage is strictly prohibited and may result in account suspension.",
  },
  {
    title: "Data Retention",
    description:
      "Free plan data is retained for 90 days. After this period, inactive data may be archived or deleted. Upgrade to a paid plan for extended retention.",
  },
  {
    title: "Rate Limiting",
    description:
      "API requests and form submissions are rate-limited to prevent abuse. Limits reset daily and vary based on your plan tier.",
  },
];

export default function FairUsePage() {
  return (
    <>
      <main className="w-full px-3">
        <div className="max-w-4xl mx-auto grid pt-4 border-x relative">
          <Nav />

          {/* Header Section */}
          <section className="w-full relative overflow-hidden py-32 px-4">
            <div className="space-y-8 py-2">
              <Badge variant="outline" className="w-fit">
                Fair Use Policy
              </Badge>
              <h1 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                Fair use policy for free users
              </h1>
              <p className="max-w-lg text-left text-muted-foreground text-balance">
                {` To ensure fair access and maintain service quality for all users,
                we've established reasonable usage limits for our free plan. These
                limits help us provide a stable, reliable service while allowing
                you to explore Planetform's capabilities.`}
              </p>
            </div>
          </section>

          {/* Limits Section */}
          <section className="w-full py-32 px-4">
            <div className="grid gap-32">
              <div className="space-y-8">
                <Badge variant="outline" className="w-fit">
                  Usage Limits
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Free plan limits
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  The following limits apply to all free plan users. Upgrade to
                  a paid plan to remove or increase these limits.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                {limits.map((limit, i) => {
                  const Icon = limit.icon;
                  return (
                    <div
                      key={limit.title}
                      className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                      <div className="relative space-y-4">
                        <div className="size-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-6" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">
                            {limit.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {limit.description}
                          </p>
                          <div className="pt-2">
                            <Badge variant="secondary" className="w-fit">
                              {limit.limit}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Policies Section */}
          <section className="w-full py-32 px-4">
            <div className="grid gap-32">
              <div className="space-y-8">
                <Badge variant="outline" className="w-fit">
                  Policies
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Additional policies
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  These policies ensure fair usage and maintain service quality
                  for all users.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                {policies.map((policy, i) => (
                  <div
                    key={policy.title}
                    className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    <div className="relative space-y-2">
                      <h3 className="text-xl font-semibold">{policy.title}</h3>
                      <p className="text-muted-foreground">
                        {policy.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Important Notice */}
          <section className="w-full py-32 px-4">
            <div className="flex items-center justify-center gap-32 px-4 bg-foreground py-36 rounded-4xl">
              <div className="space-y-8 text-background text-center">
                <div className="size-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <AlertCircle className="size-6" />
                </div>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Important notice
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  These limits are subject to change. We reserve the right to
                  modify fair use policies to ensure service quality. Users will
                  be notified of significant changes with at least 30 days
                  notice. For questions or to request limit adjustments, please
                  contact our support team.
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
