import { PlusIcon, Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { createWorkspace } from "@/hooks/use-workspace";
import { createNewForm } from "@/hooks/use-form";
import { toastPromiseOptions } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { EmptyWorkspaces } from "./empty-workspace";
import { UpgradeModal } from "@/components/billing/upgrade-modal";
import { useCanCreateForm, useCanCreateWorkspace } from "@/hooks/gates";
import type { IUser } from "@/lib/session";

export const DashboardHome = ({
  user,
  workspaces,
  analytics,
}: {
  user: IUser;
  workspaces: { name: string | null; id: string }[] | undefined;
  analytics: { TotalWorkspaces?: number; TotalForms?: number } | undefined;
}) => {
  const navigate = useNavigate();

  const workspacesLen = useMemo(
    () => (workspaces ? workspaces.length : 0),
    [workspaces],
  );
  const [workspaceState, setWorkspaceState] = useState({
    open: false,
    workspaceName: "",
  });
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check if user can create more workspaces
  const { canCreate: canCreateWorkspace, currentCount, maxWorkspaces, isLoading: isCheckingWorkspaceLimit } = useCanCreateWorkspace(user?.id);


  const onOpenChange = useCallback(
    (v: boolean) => {
      // Check limit before opening
      if (v && !isCheckingWorkspaceLimit && !canCreateWorkspace) {
        setShowUpgradeModal(true);
        return;
      }
      setWorkspaceState({ ...workspaceState, open: v });
    },
    [workspaceState, canCreateWorkspace, isCheckingWorkspaceLimit],
  );

  const onWorkspaceNameChange = useCallback(
    (v: string) => {
      setWorkspaceState({ ...workspaceState, workspaceName: v });
    },
    [workspaceState],
  );

  const handleCreateWorkspace = useCallback(async () => {
    if (!user || !user.id || !workspaceState.workspaceName) return;

    // Double-check limit before creating
    if (!canCreateWorkspace) {
      setShowUpgradeModal(true);
      return;
    }

    await createWorkspace(workspaceState.workspaceName, user.id);
    setWorkspaceState({ open: false, workspaceName: "" });
  }, [user, workspaceState, canCreateWorkspace]);

  const handleFormCreate = useCallback(async () => {
    if (!workspaces || !user) return;

    setIsCreatingForm(true);

    try {
      let targetWorkspaceId: string;

      if (!workspaces.length) {
        targetWorkspaceId = await createWorkspace("my-workspace", user?.id);
      } else {
        targetWorkspaceId = workspaces[0].id;
      }

      const form = await createNewForm(targetWorkspaceId, user.id);
      navigate(`/${form.shortId}/edit`);
    } catch (error: any) {

      const isUpgradeRequiredErr = error?.error?.includes("UPGRADE_REQUIRED")
      const errMessage = isUpgradeRequiredErr ? error?.message : "Failed to create form. Please try again."
      toast.error(errMessage);
    } finally {
      setIsCreatingForm(false);
    }
  }, [workspaces, navigate, user]);

  return (
    <div className="grid gap-4">
      <div className=" flex items-center justify-between">
        <h3>Dashboard</h3>
        <Button onClick={handleFormCreate} disabled={isCreatingForm}>
          {isCreatingForm ? <Loader2 className="animate-spin" /> : <PlusIcon />}
          <span>{isCreatingForm ? "Creating..." : "Form"}</span>
        </Button>
      </div>

      <div className="grid gap-1 md:grid-cols-2">
        <div className="p-1 bg-muted rounded-sm">
          <h3 className="py-2 text-xs px-1">Workspaces</h3>
          <Card className="bg-card ring-0 rounded-sm">
            <CardHeader>
              <CardDescription>Total workspaces</CardDescription>
            </CardHeader>
            <CardContent className="text-xl">
              {analytics?.TotalWorkspaces}
            </CardContent>
          </Card>
        </div>
        <div className="p-1 bg-muted rounded-sm">
          <h3 className="pt-2 pb-2 text-xs px-1">Forms</h3>
          <Card className="bg-card ring-0 rounded-sm">
            <CardHeader>
              <CardDescription>Total forms</CardDescription>
            </CardHeader>
            <CardContent className="text-xl">
              {analytics?.TotalForms}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className=" flex items-center justify-between">
        <h3>Workspaces</h3>
        <WorkspaceDialog
          workspaceName={workspaceState.workspaceName}
          open={workspaceState.open}
          onOpenChange={onOpenChange}
          onWorkspaceNameChange={onWorkspaceNameChange}
          handleCreateWorkspace={handleCreateWorkspace}
          workspaceLen={workspacesLen}
        />
      </div>
      <ItemGroup>
        {workspaces && workspaces.length > 0 ? (
          workspaces.map((w) => {
            return (
              <Link to={`/dashboard/${w.id}`} key={w.id}>
                <Item key={w.id} variant={"muted"}>
                  <ItemContent className="py-3">
                    <ItemTitle>{w.name}</ItemTitle>
                  </ItemContent>
                </Item>
              </Link>
            );
          })
        ) : (
          <EmptyWorkspaces />
        )}
      </ItemGroup>

      {/* Upgrade Modal for Workspace Limit */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="workspaces"
        currentCount={currentCount}
        maxCount={maxWorkspaces}
      />
    </div>
  );
};

export const WorkspaceDialog = ({
  open,
  onOpenChange,
  workspaceName,
  onWorkspaceNameChange,
  handleCreateWorkspace,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  workspaceName: string;
  onWorkspaceNameChange: (v: string) => void;
  handleCreateWorkspace: () => Promise<void>;
  workspaceLen: number;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button variant={"secondary"}>
            <PlusIcon />
            <span>workspace</span>
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new workspace</DialogTitle>
          <DialogDescription>
            workspace will help you to manage your form , think of it like a
            folders . As folders have multiple files , similarly you can have
            multiple forms in a workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1">
          <Label htmlFor="workspace" className="mb-2">
            Workspace name
          </Label>
          <Input
            value={workspaceName}
            onChange={(e) => onWorkspaceNameChange(e.currentTarget.value)}
            id="workspace"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                toast.promise(
                  handleCreateWorkspace,
                  toastPromiseOptions({
                    error: "failed to create workspace",
                    loading: "creating...",
                    success: `${workspaceName} created`,
                  }),
                );
              }
            }}
            placeholder="my-workspace"
          />
        </div>
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              toast.promise(
                handleCreateWorkspace,
                toastPromiseOptions({
                  error: "failed to create workspace",
                  loading: "creating...",
                  success: `${workspaceName} created`,
                }),
              )
            }
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
