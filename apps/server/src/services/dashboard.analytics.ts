import { eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { form as formTable } from "../db/schema/form";
import { commonCatch } from "../utils/error";
import { workspace as workspaceTable } from "../db/schema/workspace";
import { respondent as respondentTable } from "../db/schema/respondent";

export const getCustomerFormsSerive = async (customerId: string) => {
  try {
    const db = await getDb();
    const forms = await db.$count(
      formTable,
      eq(formTable.customerId, customerId)
    );

    return forms;
  } catch (e) {
    commonCatch(e);
  }
};

export const getTotalFormsCountSerive = async () => {
  try {
    const db = await getDb();
    return await db.$count(formTable);
  } catch (e) {
    commonCatch(e);
  }
};

export const getCustomerWorkspacesService = async (customerId: string) => {
  try {
    const db = await getDb();
    const workspaces = await db.$count(
      workspaceTable,
      eq(workspaceTable.customerId, customerId)
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

export const getCustomerRespondentsservice = async (customerId: string) => {
  try {
    const db = await getDb();
    const respondents = await db.$count(
      respondentTable,
      eq(respondentTable.customerId, customerId)
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

export const clientDashAnalyticsService = async (customerId: string) => {
  const workspaces = await getCustomerWorkspacesService(customerId);
  const forms = await getCustomerFormsSerive(customerId);
  const respondents = await getCustomerRespondentsservice(customerId);
  return {
    workspaces,
    forms,
    respondents,
  };
};
