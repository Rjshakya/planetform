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
  "7d": sql`NOW() - INTERVAL '6 days'`,
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
    const isShortInterval = ["3h", "6h", "12h", "24h"].includes(interval);
    const truncUnit = isShortInterval ? "hour" : "day";
    const seriesInterval = isShortInterval ? "1 hour" : "1 day";

    const visitors = await db.execute(sql`
      WITH date_series AS (
        SELECT generate_series(
          DATE_TRUNC(${truncUnit}, ${intervalVal}),
          DATE_TRUNC(${truncUnit}, NOW()),
          ${seriesInterval}::interval
        ) AS date
      ),
      visitor_data AS (
        SELECT
          COUNT(*) as count,
          DATE_TRUNC(${truncUnit}, ${respondentTable.createdAt}) as date
        FROM ${respondentTable}
        WHERE ${respondentTable.form} = ${formId}
          AND ${respondentTable.createdAt} >= ${intervalVal}
        GROUP BY date
      )
      SELECT
        COALESCE(visitor_data.count, 0) as count,
        date_series.date as date
      FROM date_series
      LEFT JOIN visitor_data ON date_series.date = visitor_data.date
      ORDER BY date_series.date ASC
    `);

    return visitors.rows;
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
    const isShortInterval = ["3h", "6h", "12h", "24h"].includes(interval);
    const truncUnit = isShortInterval ? "hour" : "day";
    const seriesInterval = isShortInterval ? "1 hour" : "1 day";

    const uniqueVisitors = await db.execute(sql`
      WITH date_series AS (
        SELECT generate_series(
           DATE_TRUNC(${truncUnit}, ${intervalVal}),
           DATE_TRUNC(${truncUnit}, NOW()),
          ${seriesInterval}::interval
        ) AS date
      ),
      visitor_data AS (
        SELECT
          COUNT(DISTINCT ${respondentTable.ip}) as count,
          DATE_TRUNC(${truncUnit}, ${respondentTable.createdAt}) as date
        FROM ${respondentTable}
        WHERE ${respondentTable.form} = ${formId}
          AND ${respondentTable.createdAt} >= ${intervalVal}
        GROUP BY date
      )
      SELECT
        COALESCE(visitor_data.count, 0) as count,
        date_series.date as date
      FROM date_series
      LEFT JOIN visitor_data ON date_series.date = visitor_data.date
      ORDER BY date_series.date ASC
    `);

    return uniqueVisitors.rows;
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
    const isShortInterval = ["3h", "6h", "12h", "24h"].includes(interval);
    const truncUnit = isShortInterval ? "hour" : "day";
    const seriesInterval = isShortInterval ? "1 hour" : "1 day";

    const submissions = await db.execute(sql`
      WITH date_series AS (
        SELECT generate_series(
           DATE_TRUNC(${truncUnit}, ${intervalVal}),
           DATE_TRUNC(${truncUnit}, NOW()),
          ${seriesInterval}::interval
        ) AS date
      ),
      submission_data AS (
        SELECT
          COUNT(DISTINCT ${responsesTable.respondent}) as count,
          DATE_TRUNC(${truncUnit}, ${respondentTable.createdAt}) as date
        FROM ${responsesTable}
        INNER JOIN ${respondentTable}
          ON ${respondentTable.id} = ${responsesTable.respondent}
        WHERE ${responsesTable.form} = ${formId}
          AND ${respondentTable.createdAt} >= ${intervalVal}
        GROUP BY date
      )
      SELECT
        COALESCE(submission_data.count, 0) as count,
        date_series.date as date
      FROM date_series
      LEFT JOIN submission_data ON date_series.date = submission_data.date
      ORDER BY date_series.date ASC
    `);

    return submissions.rows;
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
    const isShortInterval = ["3h", "6h", "12h", "24h"].includes(interval);
    const truncUnit = isShortInterval ? "hour" : "day";
    const seriesInterval = isShortInterval ? "1 hour" : "1 day";

    const submissions = await db.execute(sql`
      WITH date_series AS (
        SELECT generate_series(
          DATE_TRUNC(${truncUnit}, ${intervalVal}),
          DATE_TRUNC(${truncUnit}, NOW()),
          ${seriesInterval}::interval
        ) AS date
      ),
      submission_data AS (
        SELECT
          COUNT(DISTINCT ${respondentTable.ip}) as count,
          DATE_TRUNC(${truncUnit}, ${respondentTable.createdAt}) as date
        FROM ${responsesTable}
        INNER JOIN ${respondentTable}
          ON ${respondentTable.id} = ${responsesTable.respondent}
        WHERE ${responsesTable.form} = ${formId}
          AND ${respondentTable.createdAt} >= ${intervalVal}
        GROUP BY date
      )
      SELECT
        COALESCE(submission_data.count, 0) as count,
        date_series.date as date
      FROM date_series
      LEFT JOIN submission_data ON date_series.date = submission_data.date
      ORDER BY date_series.date ASC
    `);

    return submissions.rows;
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
