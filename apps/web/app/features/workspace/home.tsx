import {
  Ellipsis,
  MoveUpRight,
  PlusIcon,
  TriangleAlert,
  Loader2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useParams, useRevalidator } from "react-router";
import { toast } from "sonner";
import { deleteForm, createNewForm } from "@/hooks/use-form";
import { toastPromiseOptions } from "@/lib/toast";
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
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyForms } from "./empty-forms";
import { WorkspaceSettings } from "./setting";
import { UpgradeModal } from "@/components/billing/upgrade-modal";
import { useCanCreateForm } from "@/hooks/gates";
import { clientUrl } from "@/lib/env";
import type { Workspace } from "@/hooks/use-workspace";
import type { IUser } from "@/lib/session";

export const WorkspaceHome = ({
  user,
  workspace,
}: {
  user: IUser;
  workspace: Workspace;
}) => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("forms");
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const revalidator = useRevalidator();

  // Check if user can create more forms in this workspace
  const { canCreate, currentCount, maxForms, isLoading: isCheckingFormLimit } = useCanCreateForm(workspaceId || "");

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("copied");
  }, []);

  const handleCreateForm = async () => {
    if (!workspaceId) return;
    
    // Check limit before creating
    if (!isCheckingFormLimit && !canCreate) {
      setShowUpgradeModal(true);
      return;
    }
    
    setIsCreatingForm(true);
    try {
      const form = await createNewForm(workspaceId, user.id);
      navigate(`/${form.shortId}/edit`);
    } catch (error) {
      toast.error("Failed to create form. Please try again.");
    } finally {
      setIsCreatingForm(false);
    }
  };

  const handleDeleteForm = useCallback(async (formId: string) => {
    await deleteForm(formId);
    revalidator.revalidate();
  }, []);

  if (!workspace) {
    return (
      <div className=" w-full min-h-screen grid place-content-center">
        <p className=" text-destructive">Failed to load workspace</p>
      </div>
    );
  }

  return (
    <div className=" grid gap-4">
      <div className=" flex items-center justify-between">
        <h3 className=" capitalize">{workspace.name}</h3>
        <Button disabled={isCreatingForm} onClick={handleCreateForm}>
          {isCreatingForm ? <Loader2 className="animate-spin" /> : <PlusIcon />}
          <span>{isCreatingForm ? "Creating..." : "Form"}</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-fit group-data-horizontal/tabs:h-10 rounded-2xl flex relative">
          <TabsTrigger
            value="forms"
            className="border-none w-full relative data-active:bg-transparent dark:data-active:bg-transparent"
          >
            {activeTab === "forms" && (
              <motion.div
                layoutId="workspaceActiveTab"
                className="absolute inset-0 bg-input rounded-2xl"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10 px-2">Forms</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="border-none w-full relative data-active:bg-transparent dark:data-active:bg-transparent"
          >
            {activeTab === "settings" && (
              <motion.div
                layoutId="workspaceActiveTab"
                className="absolute inset-0 bg-input rounded-2xl"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10 px-2">Settings</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="forms" className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="grid bg-muted p-1 rounded-md">
              <h3 className="text-xs py-2 pl-1">Forms</h3>
              <ItemGroup className="bg-card gap-0">
                {workspace && workspace?.forms && workspace.forms.length > 0 ? (
                  workspace.forms?.map((f, i) => {
                    return (
                      <Item
                        className={`${i !== workspace.forms.length - 1 && "border-b-foreground/20"} cursor-pointer rounded-none`}
                        key={f.id}
                      >
                        <ItemContent className="py-3">
                          <Link
                            className=""
                            to={`/dashboard/submissions/${f.id}?name=${f.name}&workspace=${workspaceId}`}
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
                            <DropdownMenuContent className={"p-1"}>
                              <DropdownMenuItem>
                                <Link
                                  className="flex items-center gap-2"
                                  to={`/${f.id}`}
                                  target="_blank"
                                >
                                  <MoveUpRight className="size-4 stroke-3" />
                                  <p>Open form</p>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleCopy(`${clientUrl}/${f.id}`);
                                }}
                              >
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 fill-foreground"
                                    viewBox="0 0 24 24"
                                  >
                                    <g clip-path="url(#clip0_4418_4699)">
                                      <path
                                        d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"
                                        fill="white"
                                        style={{ fill: "var(--fillg)" }}
                                      />
                                      <path
                                        opacity="0.4"
                                        d="M17.0998 2H12.8998C9.44976 2 8.04977 3.37 8.00977 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V15.99C20.6298 15.95 21.9998 14.55 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z"
                                        fill="white"
                                        style={{ fill: "var(--fillg)" }}
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_4418_4699">
                                        <rect
                                          width="24"
                                          height="24"
                                          fill="white"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </span>
                                <p>Copy</p>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  className="flex items-center gap-2 "
                                  to={`/submissions/${f.id}?name=${f?.name}&workspace=${workspaceId}`}
                                >
                                  <span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className=" size-5 fill-foreground"
                                      viewBox="0 0 24 24"
                                    >
                                      <g clip-path="url(#clip0_4418_5191)">
                                        <path
                                          opacity="0.4"
                                          d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z"
                                          fill="white"
                                          style={{ fill: "var(--fillg)" }}
                                        />
                                        <path
                                          d="M16.8299 9.41047C16.7599 9.24047 16.6199 9.10047 16.4499 9.03047C16.3699 9.00047 16.2799 8.98047 16.1899 8.98047H14.3299C13.9399 8.98047 13.6299 9.29047 13.6299 9.68047C13.6299 10.0705 13.9399 10.3805 14.3299 10.3805H14.5099L12.3999 12.4905L11.3799 10.9705C11.2599 10.8005 11.0799 10.6805 10.8699 10.6605C10.6499 10.6405 10.4599 10.7105 10.3099 10.8605L7.32994 13.8405C7.05994 14.1105 7.05994 14.5505 7.32994 14.8305C7.46994 14.9705 7.63994 15.0305 7.81994 15.0305C7.99994 15.0305 8.17994 14.9605 8.30994 14.8305L10.6899 12.4505L11.7099 13.9705C11.8299 14.1405 12.0099 14.2605 12.2199 14.2805C12.4399 14.3005 12.6299 14.2305 12.7799 14.0805L15.4999 11.3605V11.5405C15.4999 11.9305 15.8099 12.2405 16.1999 12.2405C16.5899 12.2405 16.8999 11.9305 16.8999 11.5405V9.67047C16.8799 9.58047 16.8699 9.49047 16.8299 9.41047Z"
                                          fill="white"
                                          style={{ fill: "var(--fillg)" }}
                                        />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_4418_5191">
                                          <rect
                                            width="24"
                                            height="24"
                                            fill="white"
                                          />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  </span>
                                  <p>Submissions</p>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  className="flex items-center gap-2 "
                                  to={`/${f.id}/edit?name=${f.name}&workspace=${workspaceId}`}
                                >
                                  <span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className=" size-5 fill-foreground"
                                      viewBox="0 0 24 24"
                                    >
                                      <g clip-path="url(#clip0_4418_4832)">
                                        <path
                                          opacity="0.4"
                                          d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52V16.47C2 19.94 4.07 22 7.52 22H15.47C18.93 22 20.99 19.94 20.99 16.48V8.52C21 5.06 18.93 3 15.48 3Z"
                                          fill="white"
                                          style={{ fill: "var(--fillg)" }}
                                        />
                                        <path
                                          d="M21.02 2.98028C19.23 1.18028 17.48 1.14028 15.64 2.98028L14.51 4.10028C14.41 4.20028 14.38 4.34028 14.42 4.47028C15.12 6.92028 17.08 8.88028 19.53 9.58028C19.56 9.59028 19.61 9.59028 19.64 9.59028C19.74 9.59028 19.84 9.55028 19.91 9.48028L21.02 8.36028C21.93 7.45028 22.38 6.58028 22.38 5.69028C22.38 4.79028 21.93 3.90028 21.02 2.98028Z"
                                          fill="white"
                                          style={{ fill: "var(--fillg)" }}
                                        />
                                        <path
                                          d="M17.8601 10.4198C17.5901 10.2898 17.3301 10.1598 17.0901 10.0098C16.8901 9.88984 16.6901 9.75984 16.5001 9.61984C16.3401 9.51984 16.1601 9.36984 15.9801 9.21984C15.9601 9.20984 15.9001 9.15984 15.8201 9.07984C15.5101 8.82984 15.1801 8.48984 14.8701 8.11984C14.8501 8.09984 14.7901 8.03984 14.7401 7.94984C14.6401 7.83984 14.4901 7.64984 14.3601 7.43984C14.2501 7.29984 14.1201 7.09984 14.0001 6.88984C13.8501 6.63984 13.7201 6.38984 13.6001 6.12984C13.4701 5.84984 13.3701 5.58984 13.2801 5.33984L7.9001 10.7198C7.5501 11.0698 7.2101 11.7298 7.1401 12.2198L6.7101 15.1998C6.6201 15.8298 6.7901 16.4198 7.1801 16.8098C7.5101 17.1398 7.9601 17.3098 8.4601 17.3098C8.5701 17.3098 8.6801 17.2998 8.7901 17.2898L11.7601 16.8698C12.2501 16.7998 12.9101 16.4698 13.2601 16.1098L18.6401 10.7298C18.3901 10.6498 18.1401 10.5398 17.8601 10.4198Z"
                                          fill="white"
                                          style={{ fill: "var(--fillg)" }}
                                        />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_4418_4832">
                                          <rect
                                            width="24"
                                            height="24"
                                            fill="white"
                                          />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  </span>
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeleteDialogOpen(true)}
                              >
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className=" size-5 fill-destructive"
                                    viewBox="0 0 24 24"
                                  >
                                    <g clip-path="url(#clip0_4418_4894)">
                                      <path
                                        opacity="0.4"
                                        d="M16.1898 2H7.81978C4.17978 2 2.00977 4.17 2.00977 7.81V16.18C2.00977 19.82 4.17978 21.99 7.81978 21.99H16.1898C19.8298 21.99 21.9998 19.82 21.9998 16.18V7.81C21.9998 4.17 19.8298 2 16.1898 2Z"
                                        fill="white"
                                        style={{ fill: "var(--fillg)" }}
                                      />
                                      <path
                                        d="M16.8598 8.46008C16.0198 8.38008 15.2498 8.33008 14.4998 8.28008L14.4198 7.80008C14.3498 7.32008 14.1998 6.33008 12.6898 6.33008H11.2998C9.80979 6.33008 9.6498 7.28008 9.5698 7.79008L9.4898 8.26007C9.0598 8.29007 8.6398 8.31007 8.2098 8.35007L7.11979 8.46008C6.73979 8.50008 6.46979 8.83008 6.50979 9.21008C6.54979 9.56008 6.83979 9.83008 7.18979 9.83008C7.20979 9.83008 7.23979 9.83008 7.25979 9.83008L8.33979 9.72008C8.93979 9.67008 9.54979 9.62008 10.1498 9.59008C11.3698 9.54008 12.5898 9.56008 13.8198 9.62008C14.7298 9.66008 15.6798 9.73008 16.7198 9.83008C16.7398 9.83008 16.7598 9.83008 16.7798 9.83008C17.1298 9.83008 17.4298 9.56008 17.4598 9.21008C17.5098 8.83008 17.2398 8.49008 16.8598 8.46008Z"
                                        fill="white"
                                        style={{ fill: "var(--fillg)" }}
                                      />
                                      <path
                                        d="M15.83 11.1005C15.66 10.9105 15.41 10.8105 15.16 10.8105H8.84C8.59 10.8105 8.34 10.9205 8.17 11.1005C8 11.2905 7.91 11.5405 7.93 11.7905L8.24001 15.7505C8.30001 16.6005 8.37 17.6605 10.29 17.6605H13.71C15.63 17.6605 15.7 16.6005 15.76 15.7505L16.07 11.7905C16.09 11.5405 16 11.2905 15.83 11.1005Z"
                                        fill="white"
                                        style={{ fill: "var(--fillg)" }}
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_4418_4894">
                                        <rect
                                          width="24"
                                          height="24"
                                          fill="white"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </span>
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
                  <EmptyForms />
                )}
              </ItemGroup>
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <WorkspaceSettings workspaceName={workspace?.name || ""} />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Upgrade Modal for Form Limit */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="forms per workspace"
        currentCount={currentCount}
        maxCount={maxForms}
      />
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
