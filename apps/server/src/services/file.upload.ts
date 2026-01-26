import { env } from "cloudflare:workers";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { respondent } from "../db/schema/respondent";
import { workspace } from "../db/schema/workspace";
import { commonCatch } from "../utils/error";

interface IrespondentSignerUrl {
  fileName: string;
  formId: string;
  respondentId: string;
}

const storage = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.R2_BUCKET_ENDPOINT,
});

export const generatePutPresignedUrlService = async (
  fileName: string,
  folder: string,
) => {
  try {
    const publicDomain = env.R2_DOMAIN;
    const Key = `${folder}/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key,
    });

    const url = await getSignedUrl(storage, command, { expiresIn: 3600 });
    return {
      uploadUrl: url,
      fileUrl: `${publicDomain}/${Key}`,
    };
  } catch (e) {
    commonCatch(e);
  }
};

export const generatePresignerUrlByWrkspace = async (
  fileName: string,
  workspaceId: string,
) => {
  try {
    const db = await getDb();

    const { success } = await env.WRKSPACE_UPLOAD_LIMITER.limit({
      key: workspaceId,
    });
    if (!success) {
      return false;
    }

    const [wrkSpace] = await db
      .select({ id: workspace.id })
      .from(workspace)
      .where(eq(workspace.id, workspaceId));

    if (!wrkSpace?.id) {
      return false;
    }

    const signerUrls = await generatePutPresignedUrlService(
      fileName,
      workspaceId,
    );

    return signerUrls;
  } catch (e) {
    commonCatch(e);
  }
};

export const generatePresignerUrlByRespondent = async (
  params: IrespondentSignerUrl,
) => {
  try {
    const db = await getDb();

    const { success } = await env.RESPONDENT_UPLOAD_LIMITER.limit({
      key: params.respondentId,
    });
    if (!success) {
      return false;
    }

    const { formId, respondentId, fileName } = params;
    const [resp] = await db
      .select({ id: respondent.id })
      .from(respondent)
      .where(eq(respondent.id, respondentId));
    if (!resp?.id) {
      return false;
    }

    const signerUrls = await generatePutPresignedUrlService(fileName, formId);
    return signerUrls;
  } catch (e) {
    commonCatch(e);
  }
};

export const deleteFileService = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });
    await storage.send(command);
  } catch (e) {
    commonCatch(e);
  }
};
