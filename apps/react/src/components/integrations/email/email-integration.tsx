import { Button } from "@/components/ui/button";
import type { IntegrationCard } from "../types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback } from "react";
import {
  createEmailToRespondentIntegrations,
  deleteIntegration,
  keyOfUseIntegrations,
} from "@/hooks/use-integrations";
import { useParams } from "react-router-dom";
import { mutate } from "swr";
import { EmailConfigDialog, type EmailConfig } from "./email-config-dialog";
import { toast } from "sonner";
import { toastPromiseOptions } from "@/lib/toast";

export const EmailIntegration = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  const { formId } = useParams<{ formId: string }>();
  const handleConnect = useCallback(
    async (config: EmailConfig) => {
      if (!formId) return;
      const { body, emailFieldId, subject } = config;
      return toast.promise(
        async () => {
          await createEmailToRespondentIntegrations({
            body,
            emailFormFieldId: emailFieldId,
            subject,
            formId,
          });
          mutate(keyOfUseIntegrations(formId));
        },
        toastPromiseOptions({
          error: "Failed to create email integration",
          loading: "Integrating...",
          success: "Email Integrated",
        }),
      );
    },
    [formId],
  );

  const handleDisconnect = useCallback(async () => {
    if (!integration.connected || !formId) return;
    await deleteIntegration(integration.id);
    mutate(keyOfUseIntegrations(formId));
  }, [integration, formId]);

  return (
    <Card className="">
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
          {integration.connected ? (
            <Button
              onClick={() =>
                toast.promise(
                  handleDisconnect,
                  toastPromiseOptions({
                    error: "failed to disintegrate email",
                    loading: "Disintegrating...",
                    success: "Disintegrated",
                  }),
                )
              }
              variant="secondary"
              className=""
            >
              Disconnect
            </Button>
          ) : (
            <EmailConfigDialog
              formId={formId || ""}
              onConnect={handleConnect}
            />
          )}
        </CardAction>
      </CardContent>
    </Card>
  );
};
