import { useCallback, useEffect, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CommonMenu } from "../submissions/common-menu";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Trash, TriangleAlert } from "lucide-react";
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
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  deleteWorkspace,
  keyOfuseWorkspace,
  updateWorkspace,
} from "@/hooks/use-workspace";
import { toastPromiseOptions } from "@/lib/toast";
import { toast } from "sonner";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { mutate } from "swr";

export const WorkspaceSettings = ({
  workspaceName,
}: {
  workspaceName: string;
}) => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [open, onOpenChange] = useState(false);
  const [workspacename, setWorkspacename] = useState(workspaceName);

  const handleUpdateWorkspace = useCallback(async () => {
    if (!workspaceId || !workspacename) return;
    await updateWorkspace(workspaceId, { name: workspacename });
    mutate(keyOfuseWorkspace(workspaceId));
  }, [workspaceId, workspacename]);

  const handleDeleteWorkspace = useCallback(async () => {
    if (!workspaceId) return;
    toast.promise(
      () => deleteWorkspace(workspaceId),
      toastPromiseOptions({
        error: "failed to delete form",
        loading: "deleting...",
        success: "form deleted",
      }),
    );
    onOpenChange(false);
    navigate(`/dashboard`);
  }, [navigate, workspaceId]);

  return (
    <div className="grid mt-4">
      <Card>
        <CardHeader className="w-full">
          <CardTitle className="mb-1">Update Name</CardTitle>
          <InputGroup>
            <InputGroupInput
              value={workspacename}
              onChange={(e) => setWorkspacename(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  toast.promise(
                    handleUpdateWorkspace,
                    toastPromiseOptions({
                      error: "failed to update workspace",
                      loading: "updating...",
                      success: "workspace updated.",
                    }),
                  );
                }
              }}
              className=""
            />
            <InputGroupAddon align={"inline-end"}>
              <InputGroupButton
                onClick={() =>
                  toast.promise(
                    handleUpdateWorkspace,
                    toastPromiseOptions({
                      error: "failed to update workspace",
                      loading: "updating...",
                      success: "workspace updated.",
                    }),
                  )
                }
                variant={"secondary"}
              >
                Save
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </CardHeader>
      </Card>
      <Card className="flex flex-row gap-2">
        <CardHeader className="w-full">
          <CardTitle>Delete Workspace</CardTitle>
          <CardDescription>
            this action will delete form permanently{" "}
          </CardDescription>
        </CardHeader>
        <CardAction className="px-4">
          <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger
              render={
                <Button
                  size={"sm"}
                  className={"flex items-center gap-2"}
                  variant={"destructive"}
                >
                  Delete <Trash />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                  <TriangleAlert />
                </AlertDialogMedia>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your workspace and it's forms from our database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant={"destructive"}
                  onClick={handleDeleteWorkspace}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </Card>
    </div>
  );
};
