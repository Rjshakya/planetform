import { Nav } from "../(marketing)/landing/_components/nav";
import { Footer } from "../(marketing)/landing/_components/footer";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";

const privacySections = [
  {
    title: "Information We Collect",
    icon: FileCheck,
    content: [
      "When you sign in with Google OAuth, we collect your basic profile information including your name, email address, and profile picture.",
      "We collect form submission data, including responses and uploaded files, which you create and manage through our service.",
      "We automatically collect usage data such as IP addresses, browser type, device information, and interaction patterns to improve our service.",
      "We use cookies and similar tracking technologies to maintain your session and enhance your experience.",
    ],
  },
  {
    title: "How We Use Your Information",
    icon: Eye,
    content: [
      "To provide, maintain, and improve our form building and data collection services.",
      "To authenticate your identity when you sign in using Google OAuth.",
      "To send you service-related notifications, updates, and support communications.",
      "To analyze usage patterns and improve our product features and user experience.",
      "To detect, prevent, and address technical issues, security threats, or fraudulent activity.",
    ],
  },
  {
    title: "Data Security",
    icon: Lock,
    content: [
      "We implement industry-standard security measures including encryption in transit and at rest.",
      "Your data is stored on secure servers with regular security audits and monitoring.",
      "Access to your personal information is restricted to authorized personnel only.",
      "We use Google OAuth 2.0, which follows industry best practices for secure authentication.",
      "While we strive to protect your data, no method of transmission over the internet is 100% secure.",
    ],
  },
  {
    title: "Your Rights",
    icon: Shield,
    content: [
      "You have the right to access, update, or delete your personal information at any time.",
      "You can revoke Google OAuth access through your Google account settings.",
      "You may request a copy of your data or request data deletion by contacting us.",
      "You can opt out of non-essential communications while still receiving important service updates.",
      "If you're located in the EU, you have additional rights under GDPR including data portability and the right to object to processing.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <main className="w-full px-3">
        <div className="max-w-4xl mx-auto grid pt-4 border-x relative">
          <Nav />

          {/* Header Section */}
          <section className="w-full relative overflow-hidden py-36 px-4">
            <div className="space-y-8 py-2">
              <Badge variant="outline" className="w-fit">
                Privacy Policy
              </Badge>
              <h1 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                Privacy policy
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
                At Planetform, we take your privacy seriously. This policy
                explains how we collect, use, and protect your information,
                especially when using Google OAuth for authentication.
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
                  Google OAuth authentication
                </h2>
                <div className="space-y-4 max-w-lg">
                  <p className="text-muted-foreground">
                    {`When you choose to sign in with Google, we use Google OAuth
                    2.0 to authenticate your identity. This process is secure
                    and handled by Google's authentication servers.`}
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>
                      We only request the minimum permissions needed: your basic
                      profile information (name, email, profile picture).
                    </li>
                    <li>
                      We do not store your Google password. Authentication is
                      handled entirely by Google.
                    </li>
                    <li>
                      You can revoke our access to your Google account at any
                      time through your Google Account settings.
                    </li>
                    <li>
                      {`We comply with Google's API Services User Data Policy,
                      including the Limited Use requirements.`}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Sections */}
          <section className="w-full py-32 px-4">
            <div className="grid gap-32">
              {privacySections.map((section, i) => {
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

          {/* Data Sharing Section */}
          <section className="w-full py-32 px-4">
            <div className="grid gap-32">
              <div className="space-y-8">
                <Badge variant="outline" className="w-fit">
                  Data Sharing
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Third-party services
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  We use trusted third-party services to operate our platform.
                  These services are bound by their own privacy policies and
                  data protection agreements.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                <div className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="relative space-y-2">
                    <h3 className="text-xl font-semibold">Google Services</h3>
                    <p className="text-muted-foreground">
                      {`We use Google OAuth for authentication and may use Google
                      Cloud services for infrastructure. Your data is processed
                      according to Google's privacy policies and our data
                      processing agreements.`}
                    </p>
                  </div>
                </div>

                <div className="group relative p-8 rounded-lg bg-muted hover:border-primary/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="relative space-y-2">
                    <h3 className="text-xl font-semibold">Analytics</h3>
                    <p className="text-muted-foreground">
                      We use analytics services to understand how our service is
                      used. This helps us improve features and fix issues. All
                      analytics data is anonymized and aggregated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="w-full py-32 px-4  ">
            <div className=" px-4 bg-foreground py-36 rounded-4xl flex items-center justify-center">
              <div className="space-y-8 text-background">
                <Badge
                  variant="outline"
                  className="w-fit text-background bg-foreground"
                >
                  Contact
                </Badge>
                <h2 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
                  Questions about privacy?
                </h2>
                <p className="max-w-lg text-left text-muted-foreground text-balance">
                  {`If you have questions about this privacy policy or how we
                  handle your data, please contact us. We're committed to
                  transparency and will respond to your inquiries promptly.`}
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
