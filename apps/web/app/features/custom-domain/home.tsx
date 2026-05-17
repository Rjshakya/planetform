import {
  Copy,
  Ellipsis,
  Globe,
  Loader2,
  PlusIcon,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useRevalidator } from "react-router";
import { toast } from "sonner";
import { motion } from "motion/react";
import type { IUser } from "@/lib/session";
import type {
  CustomDomain,
} from "@/hooks/use-custom-domain";
import {
  createCustomDomain,
  deleteCustomDomain,
  getDomainCname,
} from "@/hooks/use-custom-domain";
import { toastPromiseOptions } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { EmptyDomains } from "./empty-domains";
import type { WorkspaceWithForms } from "~/hooks/use-workspace";

interface CustomDomainHomeProps {
  user: IUser;
  domains: CustomDomain[];
  workspaces: WorkspaceWithForms;
}

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

export const CustomDomainHome = ({
  user,
  domains,
  workspaces,
}: CustomDomainHomeProps) => {
  const revalidator = useRevalidator();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<CustomDomain | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [selectedFormId, setSelectedFormId] = useState("");
  const [hostname, setHostname] = useState("");

  // Get CNAME value
  const [cname, setCname] = useState<string>("customers.planetform.xyz");



  // Flatten forms from all workspaces for the dropdown
  const allForms = useMemo(() => {
    if (!workspaces) return [];
    const forms: { id: string; name: string; workspaceName: string }[] = [];
    workspaces.forEach((workspace) => {
      workspace.forms?.forEach((form) => {
        forms.push({
          id: form.shortId || "",
          name: form.name,
          workspaceName: workspace.name || "Unnamed Workspace",
        });
      });
    });
    return forms;
  }, [workspaces]);

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }, []);

  const handleCreateDomain = useCallback(async () => {
    if (!selectedFormId || !hostname) {
      toast.error("Please select a form and enter a hostname");
      return;
    }

    setIsCreating(true);
    try {
      await createCustomDomain(
        { formId: selectedFormId, hostName: hostname },
        user.id,
      );
      setIsAddDialogOpen(false);
      setSelectedFormId("");
      setHostname("");
      revalidator.revalidate();
      toast.success("Custom domain created successfully");
    } catch (error) {
      toast.error("Failed to create custom domain");
    } finally {
      setIsCreating(false);
    }
  }, [selectedFormId, hostname, user.id, revalidator]);

  const handleDeleteDomain = useCallback(async () => {
    if (!domainToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCustomDomain(
        domainToDelete.id,
        user.id,
        domainToDelete.formId,
      );
      setIsDeleteDialogOpen(false);
      setDomainToDelete(null);
      revalidator.revalidate();
      toast.success("Custom domain deleted successfully");
    } catch (error) {
      toast.error("Failed to delete custom domain");
    } finally {
      setIsDeleting(false);
    }
  }, [domainToDelete, user.id, revalidator]);

  const openDeleteDialog = useCallback((domain: CustomDomain) => {
    setDomainToDelete(domain);
    setIsDeleteDialogOpen(true);
  }, []);

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3>Custom Domains</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger
            render={
              <Button disabled={isCreating}>
                {isCreating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <PlusIcon />
                )}
                <span>{isCreating ? "Creating..." : "Add Domain"}</span>
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Domain</DialogTitle>
              <DialogDescription>
                Connect your own domain to make your forms look more
                professional.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="form">Select Form</Label>
                <Select

                  value={selectedFormId}
                  onValueChange={(formId) => setSelectedFormId(formId ?? "")}
                >
                  <SelectTrigger id="form">
                    <SelectValue>
                      {
                        selectedFormId ? selectedFormId : "select a form"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className={""} >
                    {allForms.map((form) => (
                      <SelectItem className={"w-full"} key={form.id} value={form.id}>
                        {form.name}
                        {/* ({form.workspaceName}) */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hostname">Hostname</Label>
                <Input
                  id="hostname"
                  value={hostname}
                  onChange={(e) => setHostname(e.currentTarget.value)}
                  placeholder="forms.example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the subdomain or domain you want to use (e.g.,{" "}
                  forms.yourdomain.com)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.promise(
                    handleCreateDomain,
                    toastPromiseOptions({
                      loading: "Creating domain...",
                      success: "Domain created successfully",
                      error: "Failed to create domain",
                    }),
                  );
                }}
                disabled={!selectedFormId || !hostname || isCreating}
              >
                {isCreating ? <Loader2 className="animate-spin mr-2" /> : null}
                Create Domain
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* CNAME Instructions Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="size-4" />
              DNS Configuration
            </CardTitle>
            <CardDescription>
              Point your domain&apos;s CNAME record to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="bg-background px-3 py-2 rounded-md text-sm flex-1 font-mono">
                {cname}
              </code>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopy(cname)}
              >
                <Copy className="size-4 mr-1" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Domain List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
      >
        <div className="grid bg-muted p-1 rounded-md">
          <h3 className="text-xs py-2 pl-1">Domains</h3>
          <ItemGroup className="bg-card gap-0">
            {domains && domains.length > 0 ? (
              domains.map((domain, i) => (
                <Item
                  key={domain.id}
                  className={`${i !== domains.length - 1 && "border-b-foreground/20"} rounded-none`}
                >
                  <ItemContent className="py-3">
                    <ItemTitle>{domain.hostName}</ItemTitle>
                    <ItemDescription className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${getStatusColor(domain.status)}`}
                      >
                        {domain.status}
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
                      <DropdownMenuContent className="p-1">
                        <DropdownMenuItem
                          onClick={() => handleCopy(domain.hostName)}
                        >
                          <Copy className="size-4 mr-2" />
                          Copy Hostname
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopy(cname)}>
                          <Globe className="size-4 mr-2" />
                          Copy CNAME Target
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => openDeleteDialog(domain)}
                        >
                          <Trash className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </ItemActions>
                </Item>
              ))
            ) : (
              <EmptyDomains />
            )}
          </ItemGroup>
        </div>
      </motion.div>

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
              <strong>{domainToDelete?.hostName}</strong> from your account.
              Your form will no longer be accessible at this domain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteDomain}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="animate-spin mr-2" /> : null}
              Delete Domain
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
