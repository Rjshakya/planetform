import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Globe } from "lucide-react";

export function EmptyDomains() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Globe />
        </EmptyMedia>
        <EmptyTitle>No Custom Domains</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t added any custom domains yet. Connect your own domain
          to make your forms look more professional.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
