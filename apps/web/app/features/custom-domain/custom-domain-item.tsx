import { Copy, Ellipsis, Globe, Loader2, Trash } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { CustomDomain } from "@/hooks/use-custom-domain";
import { deleteCustomDomain, useDomainStatus } from "@/hooks/use-custom-domain";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    case "pending":
    case "pending_validation":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
    case "blocked":
    case "failed":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

interface CustomDomainItemProps {
  domain: CustomDomain;
  cname: string;
  userId: string;
  className?: string;
}

export function CustomDomainItem({
  domain,
  cname,
  userId,
  className,
}: CustomDomainItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { status } = useDomainStatus(domain.id)

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }, []);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteCustomDomain(domain.id, userId, domain.formId);
      setIsDeleteDialogOpen(false);
      toast.success("Custom domain deleted successfully");
    } catch (error) {
      toast.error("Failed to delete custom domain");
    } finally {
      setIsDeleting(false);
    }
  }, [domain.id, domain.formId, userId]);

  return (
    <>
      <Item className={`${className || ""} rounded-none`}>
        <ItemContent className="py-3">
          <ItemTitle>{domain.hostName}</ItemTitle>
          <ItemDescription className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className={`text-xs capitalize ${getStatusColor(status?.status ?? "")}`}
            >
              {status?.status}
            </Badge>
            <span className="text-muted-foreground">
              • Form ID: {domain.formId.slice(0, 8)}...
            </span>
          </ItemDescription>
        </ItemContent>

        <ItemActions>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm">
                  <Ellipsis />
                </Button>
              }
            />
            <DropdownMenuContent className="p-1 w-48">
              <DropdownMenuItem className="w-full" onClick={() => handleCopy(domain.hostName)}>
                <Copy className=" " />
                Copy Hostname
              </DropdownMenuItem>
              <DropdownMenuItem className={"w-full"} onClick={() => handleCopy(cname)}>
                <Globe className="" />
                Copy CNAME Target
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"w-full "}
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className=" " />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Item>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <TriangleAlert />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete Custom Domain?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the custom domain{" "}
              <strong>{domain.hostName}</strong> from your account.
              Your form will no longer be accessible at this domain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="animate-spin mr-2" /> : null}
              Delete Domain
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
