import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GmailIntegration } from "../gmail/gmail-integration";
import { GoogleSheetIntegration } from "../google-sheets/google-sheet-integration";
import { NotionIntegration } from "../notion/notion-integration";
import { SlackIntegration } from "../slack/slack-integration";
import type { IntegrationCard } from "../types";
import { WebhookIntegration } from "../webhook/webhook-integration";

export const NotionIntegrationCard = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{integration.name}</CardTitle>
        <CardDescription>
          {integration.connected
            ? "Connected to Notion"
            : integration.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotionIntegration integration={integration} />
      </CardContent>
    </Card>
  );
};

export const GoogleSheetIntegrationCard = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{integration.name}</CardTitle>
        <CardDescription>
          {integration.connected
            ? "Connected to Google Sheets"
            : integration.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GoogleSheetIntegration integration={integration} />
      </CardContent>
    </Card>
  );
};

export const GmailIntegrationCard = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{integration.name}</CardTitle>
        <CardDescription>
          {integration.connected
            ? "Gmail notifications configured"
            : integration.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GmailIntegration integration={integration} />
      </CardContent>
    </Card>
  );
};

export const SlackIntegrationCard = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{integration.name}</CardTitle>
        <CardDescription>
          {integration.connected
            ? "Connected to Slack"
            : "Post form submissions to Slack channels"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SlackIntegration integration={integration} />
      </CardContent>
    </Card>
  );
};

export const WebhookIntegrationCard = ({
  integration,
}: {
  integration: IntegrationCard;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{integration.name}</CardTitle>
        <CardDescription>
          {integration.connected
            ? "Webhook configured"
            : integration.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WebhookIntegration integration={integration} />
      </CardContent>
    </Card>
  );
};

export const GGSheetIntegration = GoogleSheetIntegrationCard;
