import { Result } from "better-result";
import { SlackIntegrationError } from "../../errors";

export interface ISlackIntegrationServiceParams {
  accessToken: string;
}

export interface Channel {
  id: string;
  name: string;
  creator: string;
}

export class SlackIntegrationService {
  private accessToken: string;

  constructor(params: ISlackIntegrationServiceParams) {
    this.accessToken = params.accessToken;
  }

  private error(args: {
    operation: string;
    cause: unknown;
  }): SlackIntegrationError {
    return new SlackIntegrationError(args);
  }

  /**
   * Get all Slack channels for the workspace
   * @returns Array of channels with id and name
   */
  async getChannels(): Promise<Result<Channel[], SlackIntegrationError>> {
    return Result.tryPromise({
      try: async () => {
        const response = await fetch(
          "https://slack.com/api/conversations.list?types=public_channel",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json<{
          ok: boolean;
          channels?: Array<{ id: string; name: string; creator: string }>;
          error?: string;
        }>();

        if (!data.ok) {
          throw new Error(data.error || "Failed to fetch channels");
        }

        return (
          data.channels?.map((channel) => ({
            id: channel.id,
            name: channel.name,
            creator: channel.creator,
          })) || []
        );
      },
      catch: (e) => this.error({ operation: "getChannels", cause: e }),
    });
  }

  /**
   * Get Slack bot/user info to identify the creator
   * @returns The bot/user ID
   */
  async getAuthInfo(): Promise<
    Result<{ userId: string }, SlackIntegrationError>
  > {
    return Result.tryPromise({
      try: async () => {
        const response = await fetch("https://slack.com/api/auth.test", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json<{
          ok: boolean;
          user_id?: string;
          error?: string;
        }>();

        if (!data.ok) {
          throw new Error(data.error || "Failed to fetch auth info");
        }

        return { userId: data.user_id || "unknown" };
      },
      catch: (e) => this.error({ operation: "getAuthInfo", cause: e }),
    });
  }

  /**
   * Post message to a channel with formatted blocks and emojis
   * @param params - Message parameters
   */
  async postMessage(params: {
    channelId: string;
    formId: string;
    formName: string;
    message: string;
    submissions: string;
  }): Promise<Result<void, SlackIntegrationError>> {
    return Result.tryPromise({
      try: async () => {
        const { channelId, formId, formName, message, submissions } = params;

        // Build Slack message blocks with emojis
        const blocks = [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `📋 New Form Submission: ${formName}`,
              emoji: true,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Form Name:*\n${formName}`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `💬 *Message:*\n${message}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `💬 *Submissions:*\n${submissions}`,
            },
          },
          {
            type: "divider",
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `🕐 Submitted via PlanetForm`,
              },
            ],
          },
        ];

        const response = await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: channelId,
            blocks: blocks,
            text: `New submission for ${formName}: ${message}`,
          }),
        });

        const data = await response.json<{
          ok: boolean;
          error?: string;
        }>();

        if (!data.ok) {
          throw new Error(data.error || "Failed to post message");
        }
      },
      catch: (e) => this.error({ operation: "postMessage", cause: e }),
    });
  }
}
