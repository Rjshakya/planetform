import { Result } from "better-result";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { getDb } from "../../db/config";
import { integration as integrationTable } from "../../db/schema/integration";
import { SlackIntegrationError } from "../../errors";
import { getUserCredentials } from "../../utils/auth";
import { SlackIntegrationService } from "./slack";
import { SLACK_INTEGRATION_TYPE } from "../integration";

export type SlackIntegrationMetaData = {
  id: string;
  url: string;
  slackCreator: string;
  fields: string[];
  message: string;
};

export const GetSlackChannelsSchema = z.object({
  userId: z.string(),
});

export const CreateSlackIntegrationSchema = z.object({
  formId: z.string(),
  channelId: z.string().min(3),
  channelName: z.string().min(3),
  creator: z.string(),
  fields: z.array(z.string()),
  message: z.string(),
});

export const PostMessageSchema = z.object({
  integrationId: z.string(),
  formId: z.string(),
  formName: z.string(),
  message: z.string(),
});

/**
 * Get all Slack channels for a user
 * @param userId - The user ID
 */
export const getSlackChannels = async (userId: string) => {
  return Result.tryPromise({
    try: async () => {
      const tokens = (await getUserCredentials(userId, "slack")).unwrap();
      const slackService = new SlackIntegrationService({
        accessToken: tokens.accessToken,
      });
      const channels = (await slackService.getChannels()).unwrap();
      return channels;
    },
    catch: (e) =>
      new SlackIntegrationError({
        operation: "getSlackChannels",
        cause: e,
      }),
  });
};

/**
 * Create a Slack integration for a form
 * @param params - Integration parameters
 */
export const createSlackIntegration = async (params: {
  formId: string;
  userId: string;
  channelId: string;
  channelName: string;
  creator: string;
  fields: string[];
  message: string;
}) => {
  return Result.tryPromise({
    try: async () => {
      const {
        formId,
        userId,
        channelId,
        channelName,
        creator,
        fields,
        message,
      } = params;

      const metaData: SlackIntegrationMetaData = {
        id: channelId,
        url: channelName,
        slackCreator: creator,
        fields,
        message,
      };

      const db = await getDb();
      const [integration] = await db
        .insert(integrationTable)
        .values({
          formId,
          type: SLACK_INTEGRATION_TYPE,
          customerId: userId,
          metaData: JSON.stringify(metaData),
        })
        .returning({
          id: integrationTable.id,
        });

      return {
        id: integration.id,
        channelId,
        channelName,
      };
    },
    catch: (e) =>
      new SlackIntegrationError({
        operation: "createSlackIntegration",
        cause: e,
      }),
  });
};

/**
 * Get Slack integration details by ID
 * @param integrationId - The integration ID
 */
export const getSlackIntegration = async (integrationId: string) => {
  return Result.tryPromise({
    try: async () => {
      const db = await getDb();
      const [integration] = await db
        .select({
          id: integrationTable.id,
          formId: integrationTable.formId,
          customerId: integrationTable.customerId,
          metaData: integrationTable.metaData,
          createdAt: integrationTable.createdAt,
          updatedAt: integrationTable.updatedAt,
        })
        .from(integrationTable)
        .where(
          and(
            eq(integrationTable.id, integrationId),
            eq(integrationTable.type, "slack"),
          ),
        );

      if (!integration) {
        throw new Error("Integration not found");
      }

      const metaData = JSON.parse(
        integration.metaData || "{}",
      ) as SlackIntegrationMetaData;

      return {
        ...integration,
        metaData,
      };
    },
    catch: (e) =>
      new SlackIntegrationError({
        operation: "getSlackIntegration",
        cause: e,
      }),
  });
};

/**
 * Post message to a Slack channel via integration
 * @param params - Message parameters
 */
export const postMessageToChannel = async (params: {
  integrationId: string;
  formId: string;
  formName: string;
  message: string;
  submissions: string;
}) => {
  return Result.tryPromise({
    try: async () => {
      const { integrationId, formId, formName, message, submissions } = params;

      // Get integration details
      const integration = (await getSlackIntegration(integrationId)).unwrap();

      // Get user credentials
      const tokens = (
        await getUserCredentials(integration.customerId!, "slack")
      ).unwrap();

      // Post message
      const slackService = new SlackIntegrationService({
        accessToken: tokens.accessToken,
      });

      await slackService.postMessage({
        channelId: integration.metaData.id,
        formId,
        formName,
        message,
        submissions,
      });
    },
    catch: (e) =>
      new SlackIntegrationError({
        operation: "postMessageToChannel",
        cause: e,
      }),
  });
};
