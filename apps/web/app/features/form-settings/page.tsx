import type { Route } from "./+types/page";
import { requireAuth } from "@/lib/session";
import { getFormSettings } from "@/hooks/use-form-settings";
import { FormSettingHome } from "./home";
import { FormSettingsSkeleton } from "@/components/common/skeletons";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await requireAuth();
  const settings = await getFormSettings(params.formId);
  return { formId: params.formId, settings };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <FormSettingsSkeleton />;
}

export default function FormSettingsPage({ loaderData }: Route.ComponentProps) {
  return (
    <FormSettingHome
      formId={loaderData.formId}
      formSettings={loaderData.settings}
    />
  );
}
