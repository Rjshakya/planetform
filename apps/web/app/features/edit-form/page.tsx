import type { Route } from "./+types/page";
import { requireAuth } from "@/lib/session";
import { getFormForRender } from "@/hooks/use-form";
import { EditFormHome } from "./edit";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await requireAuth();
  const data = await getFormForRender(params.formId);
  return { form: data.form as import("@/hooks/use-form").Form };
}

clientLoader.hydrate = true as const;

export default function EditFormPage({ loaderData }: Route.ComponentProps) {
  return <EditFormHome form={loaderData.form} />;
}
