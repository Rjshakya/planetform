import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import {
  createWebhookIntegration,
  deleteIntegration,
  keyOfUseIntegrations,
} from "@/hooks/use-integrations";
import type { IntegrationCard, WebhookConfig } from "../types";
import { WebhookConfigDialog } from "./webhook-config-dialog";
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

export const WebhookIntegration = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  const { formId } = useParams<{ formId: string }>();
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<WebhookConfig>({
    webhookUrl: "",
  });

  const handleConnect = useCallback(async () => {
    if (!formId || integration.connected) return;

    await createWebhookIntegration(formId, config.webhookUrl);
    mutate(keyOfUseIntegrations(formId));

    setConfig({ webhookUrl: "" });
    setOpen(false);
  }, [formId, config.webhookUrl, integration]);

  const handleDisconnect = useCallback(async () => {
    if (!integration.connected || !formId) return;
    await deleteIntegration(integration.id);
    mutate(keyOfUseIntegrations(formId));
  }, [integration, formId]);

  const handleConfigChange = useCallback((newConfig: WebhookConfig) => {
    setConfig(newConfig);
  }, []);

  return (
    <>
      {open && (
        <WebhookConfigDialog
          open={open}
          onOpenChange={setOpen}
          config={config}
          onConfigChange={handleConfigChange}
          onConnect={() =>
            toast.promise(
              handleConnect,
              toastPromiseOptions({
                error: "failed to integrate webhook",
                loading: "integrating...",
                success: "webhook integrated.",
              }),
            )
          }
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
                          error: "failed to disconnect webhook",
                          loading: "disconnecting...",
                          success: "disconnected",
                        }),
                      )
                  : () => setOpen(true)
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
