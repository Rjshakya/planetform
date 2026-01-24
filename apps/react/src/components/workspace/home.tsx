import {
  ChartBarDecreasing,
  ChartLine,
  Ellipsis,
  Loader,
  MenuIcon,
  MoveUpRight,
  Pencil,
  PlusIcon,
  TrashIcon,
  TriangleAlert,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "../ui/item";
import { Link, useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/use-workspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import { deleteForm } from "@/hooks/use-form";
import { useCallback, useState } from "react";
import { toastPromiseOptions } from "@/lib/toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { WorkspaceSettings } from "./setting";
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

export const WorkspaceHome = () => {
  const { workspaceId } = useParams();
  const { workspace, workspaceError, workspaceLoading, mutate } = useWorkspace(
    workspaceId!,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteForm = useCallback(
    async (formId: string) => {
      await deleteForm(formId);
      mutate();
    },
    [mutate],
  );

  if (workspaceError) {
    return (
      <div className=" w-full min-h-screen grid place-content-center">
        <p className=" text-destructive">Failed to load workspace</p>
      </div>
    );
  }

  if (workspaceLoading) {
    return (
      <div className=" w-full min-h-screen grid place-content-center">
        <Loader className=" animate-spin" />
      </div>
    );
  }

  return (
    <div className=" grid gap-4">
      <div className=" flex items-center justify-between">
        <h3 className=" capitalize">{workspace.name}</h3>
        <Link to={`/editor?workspace=${workspaceId}`}>
          <Button>
            <PlusIcon />
            <span>Form</span>
          </Button>
        </Link>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger value={"forms"}>Forms</TabsTrigger>
          <TabsTrigger value={"settings"}>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value={"forms"}>
          <div className=" grid bg-muted p-1">
            <h3 className=" text-xs py-2 pl-1">Forms</h3>
            <ItemGroup className="bg-card  gap-0">
              {workspace && workspace.forms.length > 0 ? (
                workspace.forms?.map((f, i) => {
                  return (
                    <Item
                      className={`${i !== workspace.forms.length - 1 && "border-b-foreground/20"} cursor-pointer`}
                      key={f.id}
                    >
                      <ItemContent className="py-3">
                        <Link
                          className=""
                          to={`/submissions/${f.id}?name=${f.name}&workspace=${workspaceId}`}
                          key={f.id}
                        >
                          <ItemTitle>{f.name}</ItemTitle>
                        </Link>
                      </ItemContent>

                      <ItemActions>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant={"ghost"} size={"icon-sm"}>
                                <Ellipsis />
                              </Button>
                            }
                          />
                          <DropdownMenuContent className={`p-1`}>
                            <DropdownMenuItem>
                              <Link
                                className="flex items-center gap-2"
                                to={`/${f.id}`}
                                target="_blank"
                              >
                                <MoveUpRight className="size-3 stroke-3" />
                                <p>Open form</p>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                className="flex items-center gap-2 text-green-500"
                                to={`/submissions/${f.id}?name=${f?.name}&workspace=${workspaceId}`}
                              >
                                <ChartLine className="size-3 stroke-3" />
                                <p>Submissions</p>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                className="flex items-center gap-2 text-blue-500"
                                to={`/${f.id}/edit?name=${f.name}`}
                              >
                                <Pencil className="size-3 stroke-3" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleteDialogOpen(true)}
                            >
                              <TrashIcon className="size-3 stroke-3" />
                              <p>Delete</p>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DeleteFormDialog
                          formId={f.id || ""}
                          handleDeleteForm={handleDeleteForm}
                          open={deleteDialogOpen}
                          setOpen={setDeleteDialogOpen}
                        />
                      </ItemActions>
                    </Item>
                  );
                })
              ) : (
                <Item>
                  <ItemContent className="py-3 items-center">
                    <ItemTitle>You have no form , please create one</ItemTitle>
                  </ItemContent>
                </Item>
              )}
            </ItemGroup>
          </div>
        </TabsContent>
        <TabsContent value={"settings"}>
          <WorkspaceSettings workspaceName={workspace?.name || ""} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const DeleteFormDialog = ({
  formId,
  handleDeleteForm,
  open,
  setOpen,
}: {
  formId: string;
  handleDeleteForm: (formId: string) => Promise<void>;
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <TriangleAlert />
          </AlertDialogMedia>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your form
            and it's submissions from our database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={"destructive"}
            onClick={() => {
              toast.promise(
                handleDeleteForm(formId),
                toastPromiseOptions({
                  loading: "deleting...",
                  success: "deleted",
                  error: "failed to delete form",
                }),
              );
              setOpen(false);
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
