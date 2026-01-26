import type { IntegrationCard } from "./types";

export * from "./components/base-integration";
export * from "./components/integration-cards";
export {
  GmailIntegrationCard as GmailIntegration,
  NotionIntegrationCard as NotionIntegration,
  SlackIntegrationCard as SlackIntegration,
  WebhookIntegrationCard as WebhookIntegration,
} from "./components/integration-cards";
export * from "./gmail/gmail-config-dialog";
export * from "./gmail/gmail-integration";
export * from "./google-sheets/google-sheet-config-dialog";
export * from "./google-sheets/google-sheet-integration";
export * from "./notion/notion-config-dialog";
export * from "./notion/notion-integration";
export * from "./slack/slack-config-dialog";
export * from "./slack/slack-integration";
export * from "./types";
export * from "./webhook/webhook-config-dialog";
export * from "./webhook/webhook-integration";
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