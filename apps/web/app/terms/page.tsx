import { Nav } from "../(marketing)/_components/nav";
import { Footer } from "../(marketing)/_components/footer";
import { Badge } from "@/components/ui/badge";
import { FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react";

const termsSections = [
  {
    title: "Acceptance of Terms",
    icon: CheckCircle,
    content: [
      "By accessing or using Planetform, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
      "If you do not agree with any of these terms, you are prohibited from using or accessing this service.",
      "We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.",
      "You must be at least 13 years old to use Planetform, or the age of majority in your jurisdiction if higher.",
    ],
  },
  {
    title: "Google OAuth Terms",
    icon: Scale,
    content: [
      "When you sign in using Google OAuth, you agree to Google's Terms of Service and Privacy Policy in addition to these terms.",
      "You grant Planetform permission to access your basic Google profile information (name, email, profile picture) for authentication purposes only.",
      "You can revoke this access at any time through your Google Account settings, which will result in loss of access to your Planetform account.",
      "We comply with Google's API Services User Data Policy, including the Limited Use requirements. We only use your Google data to provide authentication services.",
      "We do not share your Google account information with third parties except as necessary to provide our service or as required by law.",
    ],
  },
  {
    title: "User Accounts and Responsibilities",
    icon: FileText,
    content: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      "You must provide accurate, current, and complete information when creating your account.",
      "You are responsible for all content you create, submit, or transmit through Planetform, including forms and form submissions.",
      "You agree not to use the service for any illegal, harmful, or unauthorized purpose, or in any way that violates these terms.",
      "You must not attempt to gain unauthorized access to any part of the service, other accounts, or computer systems connected to the service.",
    ],
  },
  {
    title: "Prohibited Uses",
    icon: AlertTriangle,
    content: [
      "You may not use Planetform to collect, store, or transmit any content that is illegal, harmful, threatening, abusive, or violates any person's rights.",
      "You may not use the service to send spam, phishing emails, or any form of unsolicited communications.",
      "You may not attempt to circumvent security measures, rate limits, or usage restrictions.",
      "You may not use automated systems (bots, scrapers) to access the service without explicit permission.",
      "You may not reverse engineer, decompile, or disassemble any part of the service.",
      "You may not use Planetform to compete with our service or to build a similar service.",
    ],
  },
];

const additionalTerms = [
  {
    title: "Intellectual Property",
    description:
      "All content, features, and functionality of Planetform are owned by us and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of content you create, but grant us a license to use it to provide the service.",
  },
  {
    title: "Service Availability",
    description:
      "We strive to maintain high availability but do not guarantee uninterrupted access. We may perform maintenance, updates, or modifications that temporarily affect service availability. We are not liable for any downtime or service interruptions.",
  },
  {
    title: "Limitation of Liability",
    description:
      "To the maximum extent permitted by law, Planetform shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.",
  },
  {
    title: "Termination",
    description:
      "We reserve the right to suspend or terminate your account at any time for violation of these terms, illegal activity, or any other reason we deem necessary. You may terminate your account at any time by contacting us or revoking Google OAuth access.",
  },
];

export default function TermsPage() {
  return (
    <>
      <main className="w-full px-3">
        <div className="max-w-4xl mx-auto grid pt-4 border-x relative">
          <Nav />

          {/* Header Section */}
          <section className="w-full relative overflow-hidden py-36 px-4">
            <div className="space-y-8 py-2">
              <Badge variant="outline" className="w-fit">
                Terms of Service
              </Badge>
              <h1 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                Terms of service
              </h1>
              <p className="max-w-lg text-left text-muted-foreground text-balance">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="max-w-lg text-left text-muted-foreground text-balance">
                Please read these Terms of Service carefully before using
                Planetform. By using our service, especially when signing in
                with Google OAuth, you agree to these terms.
              </p>
            </div>
          </section>

          {/* Google OAuth Section */}
          <section className="w-full py-32 px-4">
            <div className=" px-4 bg-foreground py-36 rounded-4xl flex items-center justify-center">
              <div className="space-y-8 text-background">
                <Badge
                  variant="outline"
                  className="w-fit text-background bg-foreground"
                >
                  Google OAuth
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Google OAuth authentication terms
                </h2>
                <div className="space-y-4 max-w-lg">
                  <p className="text-muted-foreground">
                    By using Google OAuth to sign in to Planetform, you
                    acknowledge and agree to the following:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>
                      You are using your own Google account and have the
                      authority to grant access to it.
                    </li>
                    <li>
                      Planetform will only access the minimum information
                      necessary for authentication (name, email, profile
                      picture).
                    </li>
                    <li>
                      {` Your use of Google OAuth is also subject to Google's Terms
                      of Service and Privacy Policy.`}
                    </li>
                    <li>
                      {`You can revoke Planetform's access to your Google account
                      at any time, which will result in loss of access to your
                      Planetform account.`}
                    </li>
                    <li>
                      {`We comply with Google's API Services User Data Policy and
                      Limited Use requirements.`}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Terms Sections */}
          <section className="w-full py-32 px-4">
            <div className="grid gap-32">
              {termsSections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <div key={section.title} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="size-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-6" />
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        {section.title}
                      </h2>
                    </div>
                    <div className="space-y-4 pl-16">
                      {section.content.map((item, idx) => (
                        <div
                          key={idx}
                          className="group relative p-6 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                          <p className="relative text-muted-foreground">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Additional Terms */}
          <section className="w-full py-32 px-4">
            <div className="grid gap-32">
              <div className="space-y-8">
                <Badge variant="outline" className="w-fit">
                  Additional Terms
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Important information
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  Additional terms and conditions that govern your use of
                  Planetform.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                {additionalTerms.map((term, i) => (
                  <div
                    key={term.title}
                    className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    <div className="relative space-y-2">
                      <h3 className="text-xl font-semibold">{term.title}</h3>
                      <p className="text-muted-foreground">
                        {term.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="w-full py-32 px-4">
            <div className=" px-4 bg-foreground py-36 rounded-4xl flex items-center justify-center">
              <div className="space-y-8 text-background">
                <Badge
                  variant="outline"
                  className="w-fit text-background bg-foreground"
                >
                  Contact
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Questions about our terms?
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  {`If you have any questions about these Terms of Service,
                  please contact us. We're here to help clarify any concerns you
                  may have.`}
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
