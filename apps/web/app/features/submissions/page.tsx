import type { Route } from "./+types/page";
import { SubmissionHome } from "./home";

export default function SubmissionsPage({}: Route.ComponentProps) {
  return <SubmissionHome />;
}
