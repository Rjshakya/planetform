import { and, eq } from "drizzle-orm";
import { getDb } from "../db/config.js";
import { integration as integrationTable } from "../db/schema/integration";
import { commonCatch } from "../utils/error.js";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { getAuth } from "../utils/auth.js";
import { OAuth2Client } from "google-auth-library";
import { account } from "../db/schema/auth";
import { env } from "cloudflare:workers";
import { form as formTable } from "../db/schema/form";

export const createSheetIntegrationService = async (
  values: typeof integrationTable.$inferInsert,
  userId: string
) => {
  try {
    if (values?.type !== "google") return;

    const db = await getDb();
    let integration = await db
      .insert(integrationTable)
      .values(values)
      .returning({
        metaData: integrationTable?.metaData,
        id: integrationTable.id,
      });

    const auth = await getAuth();
    const tokens = await auth?.api?.refreshToken({
      body: { providerId: "google", userId: userId },
    });

    const oauthClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });

    const metaData = JSON.parse(integration[0]?.metaData || "");

    oauthClient.credentials.access_token = tokens.accessToken;
    oauthClient.credentials.refresh_token = tokens.refreshToken;

    const doc = await GoogleSpreadsheet.createNewSpreadsheetDocument(
      oauthClient,
      { title: metaData?.title }
    );

    metaData.id = doc.spreadsheetId;
    metaData.url = `https://docs.google.com/spreadsheets/d/${doc.spreadsheetId}/edit`;
    await db
      .update(integrationTable)
      .set({ ...values, metaData })
      .where(eq(integrationTable.id, integration[0]?.id));

    return { id: integration[0]?.id, metaData };
  } catch (error) {
    commonCatch(error);
  }
};

export const getIntegrationsService = async (formId: string) => {
  try {
    const db = await getDb();
    const res = await db.query.form.findFirst({
      where: eq(formTable.shortId, formId),
      columns: {
        name: true,
        shortId: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        integrations: {
          columns: {
            id: true,
            metaData: true,
            type: true,
          },
        },
      },
    });

    return res;
  } catch (error) {
    commonCatch(error);
  }
};

export const getIsUserConnectedWithProviderService = async (
  userId: string,
  provider: string,
  scopes: string[]
) => {
  try {
    if (!userId || !provider) return;
    const db = await getDb();
    const acc = await db
      .select({ scope: account.scope, providerId: account.providerId })
      .from(account)
      .where(and(eq(account.userId, userId), eq(account.providerId, provider)));

    console.log(acc[0]?.providerId);
    if (provider === "google") {
      return scopes.every((s) => acc[0]?.scope?.includes(s));
    }

    return acc[0]?.providerId === provider.trim();
  } catch (e) {
    commonCatch(e);
  }
};

export const createNotionPageService = async (params: {
  formId: string;
  metaData: string;
  userId: string;
  customerId: string;
}) => {
  try {
    const { formId, metaData, userId, customerId } = params;
    await env.NOTION_PAGE_CREATE_WORK_FLOW.create({
      id: `${Date.now()}-${formId}`,
      params: {
        formId,
        integrationId: null,
        userId,
        customerId,
        metaData,
      },
    });

    return true;
  } catch (e) {
    commonCatch(e);
  }
};

export const createWebHookIntegrationService = async (params: {
  formId: string;
  metaData: string;
  customerId: string;
}) => {
  try {
    const db = await getDb();
    const [res] = await db
      .insert(integrationTable)
      .values({ type: "webhook", ...params })
      .returning({ id: integrationTable.id });
    return res?.id;
  } catch (e) {
    commonCatch(e);
  }
};

export const createGmailNotifyIntegrationService = async (params: {
  formId: string;
  metaData: string;
  customerId: string;
}) => {
  try {
    const db = await getDb();
    const integrations = await db
      .select({ id: integrationTable.id })
      .from(integrationTable)
      .where(
        and(
          eq(integrationTable.formId, params.formId),
          eq(integrationTable.type, "gmail-notify")
        )
      );

    if (integrations.length) {
      return false;
    }

    const [res] = await db
      .insert(integrationTable)
      .values({ ...params, type: "gmail-notify" })
      .returning({ id: integrationTable.id });

    return res?.id;
  } catch (e) {
    commonCatch(e);
  }
};

export const createGmailIntegrationService = async (params: {
  metaData: string;
  formId: string;
  customerId: string;
}) => {
  try {
    const db = await getDb();
    const integrations = await db
      .select({ id: integrationTable.id })
      .from(integrationTable)
      .where(
        and(
          eq(integrationTable.formId, params.formId),
          eq(integrationTable.type, "gmail")
        )
      );

    if (integrations.length) {
      return false;
    }

    const [res] = await db
      .insert(integrationTable)
      .values({
        type: "gmail",
        ...params,
      })
      .returning({ id: integrationTable.id });

    return res;
  } catch (e) {
    commonCatch(e);
  }
};

export const deleteIntegrationService = async (integrationId: string) => {
  try {
    const db = await getDb();
    await db
      .delete(integrationTable)
      .where(eq(integrationTable.id, integrationId));
  } catch (e) {
    commonCatch(e);
  }
};
