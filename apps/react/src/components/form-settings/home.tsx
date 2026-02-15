import { Loader, Trash, TriangleAlert } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { mutate } from "swr";
import { deleteForm, useFormSettings } from "@/hooks/use-form";
import { keyOfuseWorkspace } from "@/hooks/use-workspace";
import { clientUrl } from "@/lib/hc";
import { toastPromiseOptions } from "@/lib/toast";
import { CommonMenu } from "../common/common-menu";
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
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CloseSettings } from "./close-settings";

export const FormSettingHome = () => {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");
  const [open, onOpenChange] = useState(false);
  const { formSettings, useFormSettingsLoading } = useFormSettings(formId);

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

  if (useFormSettingsLoading) {
    return (
      <div className="w-full">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 pb-8  ">
      <CommonMenu />

      <Tabs className={""} defaultValue={"settings"}>
        <TabsList className={" "} style={{ scrollbarWidth: "none" }}>
          <TabsTrigger
            className={"capitalize"}
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
            className={"capitalize"}
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
            className={"capitalize"}
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

        <AnimatePresence>
          <TabsContent
            value={"settings"}
            className={""}
            render={
              <motion.div
                key="form-settings-context" // Unique key is vital for AnimatePresence
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className=" grid gap-4 mt-4"
              >
                <CloseSettings
                  formId={formId || ""}
                  currentSettings={
                    formSettings || {
                      closed: false,
                      closingTime: null,
                      closeAfterSubmissions: null,
                      closedMessage: null,
                    }
                  }
                />
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
              </motion.div>
            }
          />
        </AnimatePresence>
      </Tabs>
    </div>
  );
};
