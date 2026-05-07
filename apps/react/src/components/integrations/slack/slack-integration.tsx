import { useCallback, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import {
  createSlackIntegration,
  deleteIntegration,
  keyOfUseIntegrations,
} from "@/hooks/use-integrations";
import type { IntegrationCard } from "../types";
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
import { toast } from "sonner";
import { toastPromiseOptions } from "@/lib/toast";

export const SlackIntegration = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  const { formId } = useParams<{ formId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");
  const openDialog = searchParams.get("connect");
  const { pathname } = useLocation();
  const [open, setOpen] = useState(openDialog === "slack");

  const handleLink = useCallback(async () => {
    if (!formId || !formName || !workspace) return;

    const params = new URLSearchParams({
      name: formName,
      workspace: workspace,
      connect: "slack",
    });
    const callbackURL = `${clientUrl}${pathname}?${params.toString()}`;
    await linkSlack(callbackURL);
  }, [workspace, formName, formId, pathname]);

  const handleConnect = useCallback(
    async (params: {
      formId: string;
      channelId: string;
      channelName: string;
      creator: string;
      fields: string[];
      message: string;
    }) => {
      if (!formId) return;

      await createSlackIntegration(params);
      await mutate(keyOfUseIntegrations(formId));
      setOpen(false);
      setSearchParams(`?name=${formName}&workspace=${workspace}`);
    },
    [formId, setSearchParams, formName, workspace],
  );

  const handleDisconnect = useCallback(async () => {
    if (!integration.connected || !formId) return;
    await deleteIntegration(integration.id);
    mutate(keyOfUseIntegrations(formId));
  }, [integration, formId]);

  if (!formId) {
    return null;
  }

  return (
    <>
      {open && (
        <SlackConfigDialog
          open={open}
          onOpenChange={setOpen}
          onConnect={handleConnect}
          formId={formId}
        />
      )}
      <Card>
        <div className="px-4">
          <Button className={""} variant={"secondary"} size={"icon"}>
            {integration.icon}
          </Button>
        </div>
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
                          error: "failed to disintegrate slack",
                          loading: "disintegrating...",
                          success: "slack disintegrated",
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
