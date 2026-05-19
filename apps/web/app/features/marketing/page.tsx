import type { Route } from "./+types/page";
import type { Form } from "@/hooks/use-form";
import { FormHome } from "@/features/form/home";
import { FormSkeleton } from "@/components/common/skeletons";
import { Hero } from "./hero";
import { Nav } from "./nav";
import { Features } from "./features";
import { Testimonials } from "./testimonials";
import { CTA } from "./cta";
import { Footer } from "./footer";
import { EditorShowCase } from "./editor-showcase";
import type { CustomDomain } from "@/hooks/use-custom-domain";

function isMainDomain(hostname: string): boolean {
  return (
    hostname === "planetform.xyz" ||
    hostname === "www.planetform.xyz" ||
    hostname === "localhost" ||
    hostname.endsWith(".planetform.xyz")
  );
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const hostname = new URL(request.url).hostname;

  // Check if it's the main domain
  if (isMainDomain(hostname)) {
    return { type: "marketing" as const };
  }

  // Custom domain flow
  const baseUrl =
    context.cloudflare.env.VITE_BACKEND_URL ?? "http://localhost:8787";

  // 1. Resolve hostname to domain record
  const domainRes = await fetch(
    `${baseUrl}/api/customDomain/hostname/${hostname}`
  );

  if (!domainRes.ok) {
    throw new Response("Domain not found", { status: 404 });
  }

  const domainData = (await domainRes.json()) as {
    data: CustomDomain;
    message: string;
  };

  // 2. Fetch form data using formId from domain record
  const formRes = await fetch(
    `${baseUrl}/api/form/${domainData.data.formId}`,
    {
      credentials: "include",
    }
  );

  if (!formRes.ok) {
    throw new Response("Form not found", { status: 404 });
  }

  const formData = (await formRes.json()) as { form: Form };

  return { type: "form" as const, form: formData.form };
}

export const meta: Route.MetaFunction = ({ data }: { data: { type: string, form: Form } }) => {
  if (data?.type === "form" && data.form) {
    return [
      { title: data.form.name || "Planetform" },
      {
        name: "description",
        content: data.form.name
          ? `Fill out the form: ${data.form.name}`
          : "Planetform",
      },
    ];
  }

  return [
    { title: "Planetform - Create Beautiful Forms" },
    {
      name: "description",
      content:
        "Create beautiful, customizable forms with Planetform. Build contact forms, surveys, quizzes, and more with our intuitive drag-and-drop builder.",
    },
  ];
};

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  return serverLoader();
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <FormSkeleton />;
}

function MarketingContent() {
  return (
    <>
      <main className="w-full">
        <div className="relative z-10 bg-background">
          <div className="mx-0">
            <div className="mx-auto grid pt-4 relative bg-background">
              <Nav />
              <Hero />
              <EditorShowCase />
              <Features />
              <Testimonials />
              <CTA />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default function IndexPage({ loaderData }: Route.ComponentProps) {
  if (loaderData.type === "marketing") {
    return <MarketingContent />;
  }

  return <FormHome initialForm={loaderData.form} />;
}
