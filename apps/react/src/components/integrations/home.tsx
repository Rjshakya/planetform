import { Copy } from "lucide-react";
import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useIntegrations } from "@/hooks/use-integrations";
import { IntegrationsSkeleton } from "../common/skeletons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { EmailIntegration } from "./email/email-integration";
import { GmailIntegration } from "./gmail/gmail-integration";
import { GoogleSheetIntegration } from "./google-sheets/google-sheet-integration";
import { integrationCardsData } from "./integrations";
import { NotionIntegration } from "./notion/notion-integration";
import { SlackIntegration } from "./slack/slack-integration";
import { WebhookIntegration } from "./webhook/webhook-integration";

export const IntegrationsHome = () => {
  const { formId } = useParams();
  const { integrations, isLoading } = useIntegrations(formId || "");

  const integrationUICards = useMemo(() => {
    return integrationCardsData.map((card, i) => {
      const activeData = integrations?.find((int) => int.type === card.type);
      return {
        ...card,
        id: activeData?.id || card.id,
        connected: !!activeData,
        index: i,
      };
    });
  }, [integrations]);

  if (isLoading) {
    return <IntegrationsSkeleton />;
  }

  if (!formId) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <div className="grid gap-4">
      {integrations && integrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connections</CardTitle>
            <CardDescription>your live connections</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-1">
            {integrations.map((intgre) => {
              const metaData = JSON.parse(intgre.metaData || "{}");
              let url: string =
                metaData && metaData?.url ? metaData.url : intgre.type;

              if (intgre.type === "notion") {
                url = url.replaceAll("-", "");
              }

              return (
                <InputGroup key={intgre.id}>
                  <InputGroupInput value={url} />
                  <InputGroupAddon align={"inline-end"}>
                    <InputGroupButton
                      onClick={async () => {
                        if (!window.navigator) return;

                        await window.navigator.clipboard.writeText(url);

                        toast.success("copied");
                      }}
                    >
                      <Copy />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {integrationUICards.map((integration, i) => {
          switch (integration.type) {
            case "sheets":
              return (
                <GoogleSheetIntegration
                  key={integration.id}
                  integration={{
                    ...integration,
                    index: i,
                  }}
                />
              );
            case "notion":
              return (
                <NotionIntegration
                  key={integration.id}
                  integration={{ ...integration, index: i }}
                />
              );
            case "gmail":
              return (
                <GmailIntegration
                  key={integration.id}
                  integration={{ ...integration, index: i }}
                />
              );
            case "slack":
              return (
                <SlackIntegration
                  key={integration.id}
                  integration={{ ...integration, index: i }}
                />
              );
            case "webhook":
              return (
                <WebhookIntegration
                  key={integration.id}
                  integration={{ ...integration, index: i }}
                />
              );
            case "email-to-respondent":
              return (
                <EmailIntegration
                  integration={{
                    ...integration,
                    index: i,
                  }}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};
