import { useCallback, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import {
  createSheetIntegration,
  deleteIntegration,
  keyOfUseIntegrations,
} from "@/hooks/use-integrations";
import { useUser } from "@/hooks/use-user";
import { linkGoogleSheet } from "@/lib/auth-client";
import type { GoogleSheetConfig, IntegrationCard } from "../types";
import { GoogleSheetConfigDialog } from "./google-sheet-config-dialog";
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

export const GoogleSheetIntegration = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  const { user } = useUser();
  const { formId } = useParams<{ formId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");
  const openDialog = searchParams.get("openDialog");
  const { pathname } = useLocation();
  const [open, setOpen] = useState(openDialog === "sheet");
  const [config, setConfig] = useState<GoogleSheetConfig>({
    sheetTitle: "",
  });

  const handleLink = useCallback(async () => {
    const callbackURL = `${clientUrl}${pathname}?name=${formName}&workspace=${workspace}&openDialog=sheet`;
    await linkGoogleSheet(callbackURL);
  }, [formName, pathname, workspace]);

  const handleConnect = useCallback(async () => {
    if (!formId || !user?.id || integration.connected) return;

    await createSheetIntegration(formId, config.sheetTitle, user.id);
    mutate(keyOfUseIntegrations(formId));

    setConfig({ sheetTitle: "" });
    setOpen(false);
    setSearchParams(`?name=${formName}&workspace=${workspace}`);
  }, [formId, config, user, setSearchParams, workspace, formName, integration]);

  const handleDisconnect = useCallback(async () => {
    if (!integration.connected || !formId) return;
    await deleteIntegration(integration.id);
    mutate(keyOfUseIntegrations(formId));
  }, [integration, formId]);

  const handleConfigChange = useCallback((newConfig: GoogleSheetConfig) => {
    setConfig(newConfig);
  }, []);

  return (
    <>
      {open && (
        <GoogleSheetConfigDialog
          open={open}
          onOpenChange={setOpen}
          config={config}
          onConfigChange={handleConfigChange}
          onConnect={() =>
            toast.promise(
              handleConnect,
              toastPromiseOptions({
                error: "failed to integrated with google sheet",
                loading: "integrating...",
                success: "Google Sheets integrated",
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
                          error: "failed to disintegrate google sheet",
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
