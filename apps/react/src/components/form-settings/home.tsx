import { useCallback, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CommonMenu } from "../common/common-menu";
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
import { deleteForm } from "@/hooks/use-form";
import { toast } from "sonner";
import { toastPromiseOptions } from "@/lib/toast";
import { clientUrl } from "@/lib/hc";
import { mutate } from "swr";
import { keyOfuseWorkspace } from "@/hooks/use-workspace";

export const FormSettingHome = () => {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");
  const [open, onOpenChange] = useState(false);

  const handleDeleteForm = useCallback(async () => {
    if (!formId || !workspace) return;
    toast.promise(
      () => deleteForm(formId),
      toastPromiseOptions({
        error: "failed to delete form",
        loading: "deleting...",
        success: "form deleted",
      }),
    );
    onOpenChange(false);
    mutate(keyOfuseWorkspace(workspace));
    navigate(`${clientUrl}/dashboard/${workspace}`);
  }, [formId, navigate, workspace]);

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 pb-8  ">
      <CommonMenu />

      <Tabs className={""} defaultValue={"settings"}>
        <TabsList
          className={"overflow-x-scroll w-full sm:w-fit "}
          style={{ scrollbarWidth: "none" }}
        >
          <TabsTrigger
          className={'capitalize'}
            onClick={() =>
              navigate(
                `/submissions/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"submissions"}
          >
            submissions
          </TabsTrigger>
          <TabsTrigger
          className={'capitalize'}
            onClick={() =>
              navigate(
                `/analytics/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"analytics"}
          >
            analytics
          </TabsTrigger>
          <TabsTrigger
          className={'capitalize'}
            onClick={() =>
              navigate(
                `/integrations/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"integration"}
          >
            integration
          </TabsTrigger>
          <TabsTrigger className={"capitalize"} value={"settings"}>
            settings
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value={"settings"}
          className={""}
          render={
            <div className=" grid gap-4 mt-4">
              <div className="flex items-center  bg-muted rounded-md py-4 px-4 ring ring-foreground/10">
                <Label
                  htmlFor="close-form"
                  className="w-full text-sm font-medium"
                >
                  Close form
                </Label>
                <Switch id="close-form" />
              </div>
              <Card className="bg-muted flex flex-row gap-2">
                <CardHeader className="w-full">
                  <CardTitle>Delete form</CardTitle>
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
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your form and it's submissions from our
                          database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant={"destructive"}
                          onClick={handleDeleteForm}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardAction>
              </Card>
            </div>
          }
        />
      </Tabs>
    </div>
  );
};
