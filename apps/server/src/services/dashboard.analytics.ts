import { eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { form as formTable } from "../db/schema/form";
import { respondent as respondentTable } from "../db/schema/respondent";
import { workspace as workspaceTable } from "../db/schema/workspace";
import { commonCatch } from "../utils/error";

export const getCustomerFormsService = async (userId: string) => {
  try {
    const db = await getDb();
    const forms = await db.$count(formTable, eq(formTable.creator, userId));

    return forms;
  } catch (e) {
    commonCatch(e);
  }
};

export const getTotalFormsCountService = async () => {
  try {
    const db = await getDb();
    return await db.$count(formTable);
  } catch (e) {
    commonCatch(e);
  }
};

export const getCustomerWorkspacesService = async (userId: string) => {
  try {
    const db = await getDb();
    const workspaces = await db.$count(
      workspaceTable,
      eq(workspaceTable.owner, userId),
    );
    return workspaces;
  } catch (e) {
    commonCatch(e);
  }
};

export const getTotalWorkspacesService = async () => {
  try {
    const db = await getDb();
    return await db.$count(workspaceTable);
  } catch (e) {
    commonCatch(e);
  }
};

export const getCustomerRespondentsService = async (userId: string) => {
  try {
    const db = await getDb();
    const respondents = await db.$count(
      respondentTable,
      eq(respondentTable.formCreatorId, userId),
    );
    return respondents;
  } catch (e) {
    commonCatch(e);
  }
};

export const getAllRespondentservice = async () => {
  try {
    const db = await getDb();
    return await db.$count(respondentTable);
  } catch (e) {
    commonCatch(e);
  }
};

export const clientDashAnalyticsService = async (userId: string) => {
  const workspaces = await getCustomerWorkspacesService(userId);
  const forms = await getCustomerFormsService(userId);
  const respondents = await getCustomerRespondentsService(userId);
  return {
    workspaces,
    forms,
    respondents,
  };
};
