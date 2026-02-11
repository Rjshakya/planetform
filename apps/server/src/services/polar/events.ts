import { Result } from "better-result";
import { polarClient } from "../../utils/auth";

type IngestRespondentEventParams = {
  metadata: {
    respondentId: string;
    formId: string;
    formCreatorId: string;
  };
  userId: string;
};

type IngestEmailSentEventParams = {
  metadata: {
    respondentId: string;
    formId: string;
    formCreatorId: string;
    from: string;
  };
  userId: string;
};

export const IngestRespondentEvent = async (
  params: IngestRespondentEventParams,
) => {
  return Result.tryPromise(async () => {
    const { metadata, userId } = params;

    await polarClient.events.ingest({
      events: [
        {
          name: "respondents",
          externalCustomerId: userId,
          metadata,
          timestamp: new Date(),
        },
      ],
    });

    return true;
  });
};

export const IngestEmailSentEvent = async (
  params: IngestEmailSentEventParams,
) => {
  return Result.tryPromise(async () => {
    const { metadata, userId } = params;
    await polarClient.events.ingest({
      events: [
        {
          name: "sent",
          externalCustomerId: userId,
          metadata,
          timestamp: new Date(),
        },
      ],
    });
  });
};
