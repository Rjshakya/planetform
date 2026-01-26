import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { useDashboardAnalytics } from "@/hooks/use-analytics";
import { createWorkspace, useUserWorkspace } from "@/hooks/use-workspace";
import { Item, ItemContent, ItemGroup, ItemTitle } from "../ui/item";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BodySkeleton } from "../common/body-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { toastPromiseOptions } from "@/lib/toast";
import { EmptyWorkspaces } from "./empty-workspace";
import { ErrorScreen } from "../common/error";

export const DashboardHome = () => {
  const { user } = useUser();
  const { analytics, error } = useDashboardAnalytics(user?.id);
  const { workspaces, workspaceError } = useUserWorkspace(user?.id);
  const navigate = useNavigate();

  const workspacesLen = useMemo(
    () => (workspaces ? workspaces.length : 0),
    [workspaces],
  );
  const [workspaceState, setWorkspaceState] = useState({
    open: false,
    workspaceName: "",
  });

  const onOpenChange = useCallback(
    (v: boolean) => {
      setWorkspaceState({ ...workspaceState, open: v });
    },
    [workspaceState],
  );

  const onWorkspaceNameChange = useCallback(
    (v: string) => {
      setWorkspaceState({ ...workspaceState, workspaceName: v });
    },
    [workspaceState],
  );

  const handleCreateWorkspace = useCallback(async () => {
    if (!user || !user.id || !workspaceState.workspaceName) return;
    await createWorkspace(workspaceState.workspaceName, user.id);
    setWorkspaceState({ open: false, workspaceName: "" });
  }, [user, workspaceState]);

  const handleFormCreate = useCallback(async () => {
    if (!workspaces || !user) return;

    if (!workspaces.length) {
      const createdWorkspaceId = await createWorkspace(
        "my-workspace",
        user?.id,
      );
      return navigate(`/editor?workspace=${createdWorkspaceId}`);
    }

    const workspace = workspaces[0].id;
    return navigate(`/editor?workspace=${workspace}`);
  }, [workspaces, navigate, user]);

  if (!analytics || !workspaces) {
    return <BodySkeleton />;
  }

  if (error || workspaceError) {
    return <ErrorScreen />;
  }

  return (
    <div className="grid gap-4">
      <div className=" flex items-center justify-between">
        <h3>Dashboard</h3>
        <Button onClick={handleFormCreate}>
          <PlusIcon />
          <span>Form</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="px-1 pb-1 bg-muted">
          <h3 className="py-2 text-xs px-1">Workspaces</h3>
          <Card className=" ring-0">
            <CardHeader>
              <CardDescription>total workspaces</CardDescription>
            </CardHeader>
            <CardContent className="text-xl">
              {analytics?.TotalWorkspaces}
            </CardContent>
          </Card>
        </div>
        <div className="px-1 pb-1 bg-muted">
          <h3 className="pt-2 pb-2 text-xs px-1">Forms</h3>
          <Card className=" ring-0">
            <CardHeader>
              <CardDescription>total forms</CardDescription>
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
