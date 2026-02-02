import useSWR from "swr";
import { client } from "@/lib/hc";

export const useIntegrations = (formId: string | null) => {
  const fetcher = (key: string) => getIntegrations(key.split(":")[1]);
  const { data, error, isLoading, mutate } = useSWR(
    formId ? `useIntegrations:${formId}` : null,
    fetcher,
  );
  return { integrations: data?.integrations, error, isLoading, mutate };
};

export const useSlackChannels = (key: string | null) => {
  const fetcher = () => getSlackChannels();
  const { data, error, isLoading } = useSWR(key, fetcher);
  return {
    channels: data,
    slackChannelsError: error,
    channelsLoading: isLoading,
  };
};

export const keyOfUseIntegrations = (formId: string) =>
  `useIntegrations:${formId}`;

export const keyOfUseSlackChannels = (formId: string) =>
  `useSlackChannels:${formId}`;

export const getIntegrations = async (formId: string) => {
  const res = await client.api.integration[":formId"].$get({
    param: { formId },
  });

  if (!res.ok) throw new Error("failed to get integrations");

  const data = await res.json();
  return data.integrations;
};

export const createSheetIntegration = async (
  formId: string,
  sheetTitle: string,
  userId: string,
) => {
  const res = await client.api.integration.sheet.$post({
    json: { formId, sheetTitle, userId },
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to create sheet integration");
  return data;
};

export const createNotionIntegration = async (
  formId: string,
  title: string,
  formFields: { id: string; label: string; type: string; order: number }[],
) => {
  const res = await client.api.integration.notion.$post({
    json: { formId, title, formFields },
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to create Notion integration");
  return data;
};

export const createWebhookIntegration = async (formId: string, url: string) => {
  const res = await client.api.integration.webhook.$post({
    json: { formId, url, headers: {} },
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to create webhook integration");
  return data;
};

export const createGmailIntegration = async (params: {
  formId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  isDynamicBody: boolean;
}) => {
  const res = await client.api.integration.gmail.$post({
    json: params,
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to create Gmail integration");
  return data;
};

export const createEmailNotificationIntegration = async (params: {
  formId: string;
  subject: string;
  body: string;
  userId: string;
}) => {
  const res = await client.api.integration["email-notification"].$post({
    json: params,
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error("Failed to create email notification integration");
  return data;
};

export const getSlackChannels = async () => {
  const res = await client.api.integration.slack.channels.$get({});
  if (!res.ok) throw new Error("failed to get slack channels");

  const parsed = await res.json();
  return parsed.channels;
};

export const createSlackIntegration = async (params: {
  formId: string;
  channelId: string;
  channelName: string;
  creator: string;
  fields: string[];
  message: string;
}) => {
  const res = await client.api.integration.slack.$post({ json: params });
  if (!res.ok) throw new Error("failed to create slack integration");
  const parsed = await res.json();
  return parsed;
};

export const deleteIntegration = async (integrationId: string) => {
  const res = await client.api.integration[":integrationId"].$delete({
    param: { integrationId },
  });
  if (!res.ok) throw new Error("Failed to delete integration");
  return true;
};
