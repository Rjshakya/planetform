import { useCallback, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import {
  createGmailIntegration,
  deleteIntegration,
  keyOfUseIntegrations,
} from "@/hooks/use-integrations";
import { useUser } from "@/hooks/use-user";
import { toastPromiseOptions } from "@/lib/toast";
import type { GmailConfig, IntegrationCard } from "../types";
import { GmailConfigDialog } from "./gmail-config-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { linkGmail } from "@/lib/auth-client";

const clientUrl = import.meta.env.VITE_CLIENT_URL ?? "";

export const GmailIntegration = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  const { user } = useUser();
  const { formId } = useParams<{ formId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");
  const openDialog = searchParams.get("connect");
  const [open, setOpen] = useState(openDialog === "gmail");
  const { pathname } = useLocation();

  const [config, setConfig] = useState<GmailConfig>({
    from: "",
    to: "",
    subject: "",
    body: "",
    isDynamicBody: false,
  });

  const handleLink = useCallback(async () => {
    const callbackURL = `${clientUrl}${pathname}?name=${formName}&workspace=${workspace}&connect=gmail`;
    await linkGmail(callbackURL);
  }, [formName, pathname, workspace]);

  const handleConnect = useCallback(async () => {
    if (!formId || integration.connected) return;

    await createGmailIntegration({
      formId,
      ...config,
      from: user.email,
    });
    mutate(keyOfUseIntegrations(formId));

    setConfig({
      from: "",
      to: "",
      subject: "",
      body: "",
      isDynamicBody: false,
    });
    setOpen(false);
    setSearchParams(`?name=${formName}&workspace=${workspace}`);
  }, [formId, config, user, formName, workspace, setSearchParams, integration]);

  const handleDisconnect = useCallback(async () => {
    if (!integration.connected || !formId) return;
    await deleteIntegration(integration.id);
    mutate(keyOfUseIntegrations(formId));
  }, [integration, formId]);

  const handleConfigChange = useCallback((newConfig: GmailConfig) => {
    setConfig(newConfig);
  }, []);

  return (
    <>
      {open && (
        <GmailConfigDialog
          open={open}
          onOpenChange={setOpen}
          config={config}
          onConfigChange={handleConfigChange}
          onConnect={() =>
            toast.promise(
              handleConnect,
              toastPromiseOptions({
                loading: "integrating gmail",
                error: "failed to integrate gmail",
                success: "Gmail integrated",
              }),
            )
          }
          userFrom={user?.email}
        />
      )}
      <Card className="">
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
                          error: "failed to disintegrate gmail",
                          loading: "disintegrating...",
                          success: "disintegrated",
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
