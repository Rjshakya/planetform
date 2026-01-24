export interface IntegrationCard {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  description: string;
  index:number
}

export interface IntegrationConfig {
  formId: string;
  formName: string | null;
  workspace: string | null;
}

export interface GoogleSheetConfig {
  sheetTitle: string;
}

export interface NotionConfig {
  title: string;
  formFields: {
    id: string;
    label: string;
    type: string;
    order: number;
  }[];
}

export interface GmailConfig {
  from: string;
  to: string;
  subject: string;
  body: string;
  isDynamicBody: boolean;
}

export interface WebhookConfig {
  webhookUrl: string;
}

export interface SlackConfig {
  webhookUrl: string;
}
