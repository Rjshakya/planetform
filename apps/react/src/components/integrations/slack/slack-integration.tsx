import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import {
  createWebhookIntegration,
  deleteIntegration,
  keyOfUseIntegrations,
} from "@/hooks/use-integrations";
import type { IntegrationCard, SlackConfig } from "../types";
import { SlackConfigDialog } from "./slack-config-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SlackIntegration = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  const { formId } = useParams<{ formId: string }>();
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<SlackConfig>({
    webhookUrl: "",
  });

  const handleConnect = useCallback(async () => {
    if (!formId) return;

    await createWebhookIntegration(formId, config.webhookUrl);
    await mutate(keyOfUseIntegrations(formId));

    setConfig({ webhookUrl: "" });
    setOpen(false);
  }, [formId, config.webhookUrl]);

  const handleDisconnect = useCallback(async () => {
    if (!integration.connected || !formId) return;
    await deleteIntegration(integration.id);
    mutate(keyOfUseIntegrations(formId));
  }, [integration, formId]);

  const handleConfigChange = useCallback((newConfig: SlackConfig) => {
    setConfig(newConfig);
  }, []);

  return (
    <>
      {open && (
        <SlackConfigDialog
          open={open}
          onOpenChange={setOpen}
          config={config}
          onConfigChange={handleConfigChange}
          onConnect={handleConnect}
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
              disabled
              onClick={
                integration.connected ? handleDisconnect : () => setOpen(true)
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
