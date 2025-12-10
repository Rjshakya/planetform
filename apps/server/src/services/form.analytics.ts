import { and, asc, count, countDistinct, eq, sql } from "drizzle-orm";
import { getDb } from "../db/config";
import { respondent as respondentTable } from "../db/schema/respondent";
import { commonCatch } from "../utils/error";
import { response as responsesTable } from "../db/schema/response";
import z from "zod";
import { intervalSchema } from "../utils/validation";

export type Interval = z.infer<typeof intervalSchema>;

const INTERVAL_MAP = {
  "3h": sql`NOW() - INTERVAL '3 hours'`,
  "6h": sql`NOW() - INTERVAL '6 hours'`,
  "12h": sql`NOW() - INTERVAL '12 hours'`,
  "24h": sql`NOW() - INTERVAL '24 hours'`,
  "7d": sql`NOW() - INTERVAL '7 days'`,
  "30d": sql`NOW() - INTERVAL '30 days'`,
  "3M": sql`NOW() - INTERVAL '3 months'`,
  "6M": sql`NOW() - INTERVAL '6 months'`,
  "1Y": sql`NOW() - INTERVAL '1 year'`,
};

export const getVisitorsService = async (formId: string) => {
  try {
    const db = await getDb();
    const visitors = await db.$count(
      respondentTable,
      eq(respondentTable.form, formId)
    );

    return visitors;
  } catch (e) {
    commonCatch(e);
  }
};

export const getUniqueVisitorService = async (formId: string) => {
  try {
    const db = await getDb();
    const [uniqVisitors] = await db
      .select({ count: countDistinct(respondentTable.ip) })
      .from(respondentTable)
      .where(eq(respondentTable.form, formId));

    return uniqVisitors?.count;
  } catch (e) {
    commonCatch(e);
  }
};

export const getSubmissionService = async (formId: string) => {
  try {
    const db = await getDb();
    const [submissions] = await db
      .select({
        count: countDistinct(responsesTable.respondent),
      })
      .from(responsesTable)
      .where(eq(responsesTable.form, formId));

    return submissions.count;
  } catch (e) {
    commonCatch(e);
  }
};

export const getUniqueSubmission = async (formId: string) => {
  try {
    const db = await getDb();
    const [submissions] = await db
      .select({
        count: countDistinct(respondentTable.ip),
      })
      .from(responsesTable)
      .innerJoin(
        respondentTable,
        eq(respondentTable.id, responsesTable.respondent)
      )
      .where(eq(responsesTable.form, formId));

    return submissions.count;
  } catch (e) {
    commonCatch(e);
  }
};

export const getVisitorsByTimeService = async (
  formId: string,
  interval: Interval
) => {
  try {
    const db = await getDb();
    const intervalVal = INTERVAL_MAP[interval];

    const visitors = await db
      .select({
        count: count(),
        date: sql`DATE_TRUNC('day',${respondentTable.createdAt})`,
      })
      .from(respondentTable)
      .where(
        and(
          eq(respondentTable.form, formId),
          sql`${respondentTable.createdAt} >= ${intervalVal}`
        )
      )
      .groupBy(sql`DATE_TRUNC('day',${respondentTable.createdAt})`)
      .orderBy(asc(sql`DATE_TRUNC('day',${respondentTable.createdAt})`));

    return visitors;
  } catch (e) {
    commonCatch(e);
  }
};

export const getUniqueVisitorByTimeService = async (
  formId: string,
  interval: Interval
) => {
  try {
    const db = await getDb();
    const intervalVal = INTERVAL_MAP[interval];
    const uniqueVisitors = await db
      .select({
        count: countDistinct(respondentTable.ip),
        date: sql`DATE_TRUNC('day',${respondentTable.createdAt})`,
      })
      .from(respondentTable)
      .where(
        and(
          eq(respondentTable.form, formId),
          sql`${respondentTable.createdAt} >= ${intervalVal}`
        )
      )
      .groupBy(sql`DATE_TRUNC('day',${respondentTable.createdAt})`)
      .orderBy(asc(sql`DATE_TRUNC('day',${respondentTable.createdAt})`));

    return uniqueVisitors;
  } catch (e) {
    commonCatch(e);
  }
};

export const getSubmissionByTimeService = async (
  formId: string,
  interval: Interval
) => {
  try {
    const db = await getDb();
    const intervalVal = INTERVAL_MAP[interval];
    const submissions = await db
      .select({
        count: countDistinct(responsesTable.respondent),
        date: sql`DATE_TRUNC('day',${respondentTable.createdAt})`,
      })
      .from(responsesTable)
      .innerJoin(
        respondentTable,
        eq(respondentTable.id, responsesTable.respondent)
      )
      .where(
        and(
          eq(responsesTable.form, formId),
          sql`${respondentTable.createdAt} >= ${intervalVal}`
        )
      )
      .groupBy(sql`DATE_TRUNC('day',${respondentTable.createdAt})`)
      .orderBy(asc(sql`DATE_TRUNC('day',${respondentTable.createdAt})`));

    return submissions;
  } catch (e) {
    commonCatch(e);
  }
};

export const getUniqueSubmissionByTimeService = async (
  formId: string,
  interval: Interval
) => {
  try {
    const db = await getDb();
    const intervalVal = INTERVAL_MAP[interval];
    const submissions = await db
      .select({
        count: countDistinct(respondentTable.ip),
        // respondent: responsesTable.respondent,
        date: sql`DATE_TRUNC('day',${respondentTable.createdAt})`,
      })
      .from(responsesTable)
      .where(
        and(
          eq(responsesTable.form, formId),
          sql`${responsesTable.createdAt} >= ${intervalVal}`
        )
      )
      .innerJoin(
        respondentTable,
        eq(respondentTable.id, responsesTable.respondent)
      )
      .groupBy(sql`DATE_TRUNC('day',${respondentTable.createdAt})`)
      .orderBy(asc(sql`DATE_TRUNC('day',${respondentTable.createdAt})`));

    return submissions;
  } catch (e) {
    commonCatch(e);
  }
};

export const getRespondentsWithCountries = async (formId: string) => {
  try {
    const db = await getDb();
  } catch (e) {
    commonCatch(e);
  }
};
