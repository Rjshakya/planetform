import { useCallback, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/use-form";
import { useFormFields } from "@/hooks/use-formFields";
import {
  createNotionIntegration,
  deleteIntegration,
  keyOfUseIntegrations,
} from "@/hooks/use-integrations";
import { linkNotion } from "@/lib/auth-client";
import type { IntegrationCard, NotionConfig } from "../types";
import { NotionConfigDialog } from "./notion-config-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { toastPromiseOptions } from "@/lib/toast";

const clientUrl = import.meta.env.VITE_CLIENT_URL ?? "";

export const NotionIntegration = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  const { formId } = useParams<{ formId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");
  const openDialog = searchParams.get("openDialog");
  const [open, setOpen] = useState(openDialog === "true");
  const { pathname } = useLocation();

  const { form } = useForm(formId || "");
  const { formFields } = useFormFields(formId);

  const [config, setConfig] = useState<NotionConfig>(() => ({
    title: "",
    formFields: [],
  }));

  const handleLink = useCallback(async () => {
    if (!formName || !pathname || !workspace) return;

    const callbackURL = `${clientUrl}${pathname}?name=${formName}&workspace=${workspace}&openDialog=true`;
    await linkNotion(callbackURL);
  }, [formName, workspace, pathname]);

  const handleConnect = useCallback(async () => {
    if (!formId || !form || !formFields || integration.connected) return;
    setOpen(true);

    const _formFields = formFields.map((f) => ({
      id: f.id,
      label: f.label,
      order: f.order,
      type: f.type || "",
    }));

    await createNotionIntegration(formId, config.title, _formFields);
    mutate(keyOfUseIntegrations(formId));

    setConfig({ title: "", formFields: [] });
    setOpen(false);
    setSearchParams(`?name=${formName}&workspace=${workspace}`);
  }, [
    formId,
    form,
    config,
    formFields,
    formName,
    workspace,
    setSearchParams,
    integration,
  ]);

  const handleDisconnect = useCallback(async () => {
    if (!integration.connected || !formId) return;
    await deleteIntegration(integration.id);
    mutate(keyOfUseIntegrations(formId));
  }, [integration, formId]);

  const handleConfigChange = useCallback((newConfig: NotionConfig) => {
    setConfig(newConfig);
  }, []);

  return (
    <>
      {open && (
        <NotionConfigDialog
          open={open}
          onOpenChange={setOpen}
          config={config}
          onConfigChange={handleConfigChange}
          onConnect={() =>
            toast.promise(
              handleConnect,
              toastPromiseOptions({
                error: "failed to integrate notion",
                loading: "integrating...",
                success: "notion integrated",
              }),
            )
          }
          formFields={config.formFields}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle>{integration.name}</CardTitle>
          <CardDescription>{integration.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <CardAction className="flex justify-start w-full">
            <Button
              onClick={
                integration.connected
                  ? () =>
                      toast.promise(
                        handleDisconnect,
                        toastPromiseOptions({
                          error: "failed to disintegrate notion",
                          loading: "Disintegrating...",
                          success: "Disintegrated",
                        }),
                      )
                  : handleLink
              }
              variant="secondary"
              className=""
            >
              {integration.connected ? "Disconnect" : "Connect"}
            </Button>
          </CardAction>
        </CardContent>
      </Card>
    </>
  );
};
