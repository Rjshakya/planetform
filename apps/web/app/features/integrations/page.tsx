import type { Route } from "./+types/page";
import { IntegrationsHome } from "./home";

export default function IntegrationsPage({}: Route.ComponentProps) {
  return <IntegrationsHome />;
}
