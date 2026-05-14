import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderIcon } from "lucide-react";

export function EmptyForms() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No Form Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any form yet. Get started by creating your
          first form.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
