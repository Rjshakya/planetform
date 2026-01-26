import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderIcon } from "lucide-react";

export function EmptyWorkspaces() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No Workspace Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any workspace yet. Get started by creating
          your first workspace.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
