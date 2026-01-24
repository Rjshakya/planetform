import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useIntegrations } from "@/hooks/use-integrations";
import { CommonMenu } from "../submissions/common-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { GmailIntegration } from "./gmail/gmail-integration";
import { GoogleSheetIntegration } from "./google-sheets/google-sheet-integration";
import { NotionIntegration } from "./notion/notion-integration";
import { SlackIntegration } from "./slack/slack-integration";
import { WebhookIntegration } from "./webhook/webhook-integration";
import { useMemo } from "react";
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
import { Copy } from "lucide-react";
import { toast } from "sonner";
import type { IntegrationCard } from "./types";

export const integrationCardsData: IntegrationCard[] = [
  {
    id: "google",
    name: "Google Sheets",
    type: "sheets",
    description: "Send form responses to Google Sheets",
    connected: false,
    index: 0,
  },
  {
    id: "notion",
    name: "Notion",
    type: "notion",
    description: "Sync form data with Notion databases",
    connected: false,
    index: 1,
  },
  {
    id: "gmail",
    name: "Gmail",
    type: "gmail",
    description: "Send email notifications via Gmail",
    connected: false,
    index: 2,
  },
  {
    id: "slack",
    name: "Slack",
    type: "slack",
    description: "Post form submissions to Slack channels",
    connected: false,
    index: 3,
  },
  {
    id: "webhook",
    name: "Webhook",
    type: "webhook",
    description: "Get form submission to your url",
    connected: false,
    index: 4,
  },
];

export const IntegrationsHome = () => {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");
  const { integrations, isLoading } = useIntegrations(formId || "");
  const navigate = useNavigate();

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
    return (
      <div className="max-w-3xl mx-auto pt-12 px-4 pb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted mb-6 rounded" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-40 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!formId) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 pb-8 ">
      <CommonMenu />

      <Tabs defaultValue={"integrations"}>
        <TabsList>
          <TabsTrigger
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
            onClick={() =>
              navigate(
                `/analytics/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"analytics"}
          >
            analytics
          </TabsTrigger>
          <TabsTrigger value={"integrations"}>integration</TabsTrigger>
          <TabsTrigger
            onClick={() =>
              navigate(
                `/settings/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"settings"}
          >
            settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value={"integrations"} className="mt-4 grid gap-4">
          {integrations && integrations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Connections</CardTitle>
                <CardDescription>your live connections</CardDescription>
              </CardHeader>

              <CardContent>
                {integrations &&
                  integrations.length > 0 &&
                  integrations.map((intgre) => {
                    const metaData = JSON.parse(intgre.metaData || "{}");
                    const url =
                      metaData && metaData?.url ? metaData.url : intgre.type;
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
                default:
                  return null;
              }
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
