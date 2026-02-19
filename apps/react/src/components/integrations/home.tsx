import { Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";
import { useIntegrations } from "@/hooks/use-integrations";
import { CommonMenu } from "../common/common-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { EmailIntegration } from "./email/email-integration";
import { GmailIntegration } from "./gmail/gmail-integration";
import { GoogleSheetIntegration } from "./google-sheets/google-sheet-integration";
import { integrationCardsData } from "./integrations";
import { NotionIntegration } from "./notion/notion-integration";
import { SlackIntegration } from "./slack/slack-integration";
import { WebhookIntegration } from "./webhook/webhook-integration";

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
    return <IntegrationsSkeleton />;
  }

  if (!formId) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 pb-8 ">
      <CommonMenu />

      <Tabs defaultValue={"integrations"}>
        <TabsList className={" "}>
          <TabsTrigger
            className={"capitalize"}
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
            className={"capitalize"}
            onClick={() =>
              navigate(
                `/analytics/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"analytics"}
          >
            analytics
          </TabsTrigger>
          <TabsTrigger className={"capitalize"} value={"integrations"}>
            integration
          </TabsTrigger>
          <TabsTrigger
            className={"capitalize"}
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
        <AnimatePresence>
          <TabsContent value={"integrations"} className="mt-4 grid gap-4">
            {integrations && integrations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Connections</CardTitle>
                  <CardDescription>your live connections</CardDescription>
                </CardHeader>

                <CardContent className="grid gap-1">
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

            <motion.div
              key="integrations-context" // Unique key is vital for AnimatePresence
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid sm:grid-cols-3 gap-4"
            >
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
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};
