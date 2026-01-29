import { useCallback, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
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
import { linkSlack } from "@/lib/auth-client";
import { clientUrl } from "@/lib/env";

export const SlackIntegration = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  const { formId } = useParams<{ formId: string }>();
  const [searchParams] = useSearchParams();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<SlackConfig>({
    webhookUrl: "",
  });

  const handleLink = useCallback(async () => {
    if (!formId || !formName || !workspace) return;

    const callbackURL = `${clientUrl}${pathname}?name=${formName}&workspace=${workspace}&openDialog=true`;
    await linkSlack(callbackURL);
  }, [workspace, formName, formId]);

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
              onClick={
                integration.connected ? handleDisconnect : () => handleLink()
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
