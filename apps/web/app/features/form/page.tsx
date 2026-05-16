import type { Form } from "~/hooks/use-form";
import type { Route } from "./+types/page";
import { FormHome } from "./home";
import { FormSkeleton } from "@/components/common/skeletons";

export async function loader({ params, context }: Route.LoaderArgs) {
  const baseUrl =
    context.cloudflare.env.VITE_BACKEND_URL ?? "http://localhost:8787";
  const res = await fetch(`${baseUrl}/api/form/${params?.formId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Response(String(error), { status: res.status });
  }
  const data = (await res.json()) as { form: Form };
  return { form: data?.form as Form };
}

export const meta: Route.MetaFunction = ({ data }: { data: { form: Form } }) => [
  { title: data?.form?.name || "Planetform" },
  {
    name: "description",
    content: data?.form?.name
      ? `Fill out the form: ${data.form.name}`
      : "Planetform",
  },
];

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  return serverLoader();
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <FormSkeleton />;
}

export default function FormPage({ loaderData }: Route.ComponentProps) {
  return <FormHome initialForm={loaderData.form} />;
}
