import { and, count, countDistinct, eq, gte, sql } from "drizzle-orm";
import type z from "zod";
import { getDb } from "../db/config";
import { respondent as respondentTable } from "../db/schema/respondent";
import { response as responsesTable } from "../db/schema/response";
import { commonCatch } from "../utils/error";
import { getDateTruncField } from "../utils/time";
import type { intervalSchema, resolutionsSchema } from "../utils/validation";

export type Interval = z.infer<typeof intervalSchema>;
export type Resolutions = z.infer<typeof resolutionsSchema>;
export type DateTruncFields =
	| "millennium"
	| "century"
	| "decade"
	| "year"
	| "quarter"
	| "month"
	| "week"
	| "day"
	| "hour"
	| "minute"
	| "second"
	| "milliseconds"
	| "microseconds";

export interface IgetFormAnalyticsBasedOnTimeParams {
	interval: Interval;
	formId: string;
	resolution: Resolutions;
}

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

export const getVisitorsByTimeService = async (
	formId: string,
	interval: Interval,
	timeZone: string,
) => {
	try {
		const db = await getDb();
		const sqlInterval = INTERVAL_MAP[interval];
		const dateTruncField = getDateTruncField(interval);

		const visitors = await db
			.select({
				count: count(),
				date: sql`DATE_TRUNC(${dateTruncField} , ${respondentTable.createdAt} , ${timeZone}) as d`,
			})
			.from(respondentTable)
			.where(
				and(
					eq(respondentTable.form, formId),
					gte(respondentTable.createdAt, sqlInterval),
				),
			)
			.groupBy(sql`d`);

		return visitors as { count: number; date: string }[];
	} catch (e) {
		commonCatch(e);
	}
};

export const getUniqueVisitorByTimeService = async (
	formId: string,
	interval: Interval,
	timeZone: string,
) => {
	try {
		const db = await getDb();
		const sqlInterval = INTERVAL_MAP[interval];
		const dateTruncField = getDateTruncField(interval);

		const uniqueVisitors = await db
			.selectDistinctOn([respondentTable.ip], {
				count: countDistinct(respondentTable.ip),
				date: sql`DATE_TRUNC(${dateTruncField} , ${respondentTable.createdAt} , ${timeZone}) as d`,
			})
			.from(respondentTable)
			.where(
				and(
					eq(respondentTable.form, formId),
					gte(respondentTable.createdAt, sqlInterval),
				),
			)
			.groupBy(respondentTable.ip, sql`d`);

		return uniqueVisitors as { count: number; date: string }[];
	} catch (e) {
		commonCatch(e);
	}
};

export const getSubmissionByTimeService = async (
	formId: string,
	interval: Interval,
	timeZone: string,
) => {
	try {
		const db = await getDb();
		const sqlInterval = INTERVAL_MAP[interval];
		const dateTruncField = getDateTruncField(interval);

		const submissions = await db
			.select({
				date: sql`DATE_TRUNC(${dateTruncField} , ${responsesTable.createdAt} , ${timeZone}) as d`,
				count: countDistinct(respondentTable.id),
			})
			.from(responsesTable)
			.leftJoin(
				respondentTable,
				eq(responsesTable.respondent, respondentTable.id),
			)
			.where(
				and(
					eq(responsesTable.form, formId),
					gte(responsesTable.createdAt, sqlInterval),
				),
			)
			.groupBy(sql`d`);

		return submissions as { count: number; date: string }[];
	} catch (e) {
		commonCatch(e);
	}
};

export const getUniqueSubmissionByTimeService = async (
	formId: string,
	interval: Interval,
	timeZone: string,
) => {
	try {
		const db = await getDb();
		const sqlInterval = INTERVAL_MAP[interval];
		const dateTruncField = getDateTruncField(interval);

		const submissions = await db

			.selectDistinctOn([respondentTable.ip], {
				date: sql`DATE_TRUNC(${dateTruncField} , ${responsesTable.createdAt} , ${timeZone}) as d`,
				count: countDistinct(respondentTable.ip),
			})
			.from(responsesTable)
			.leftJoin(
				respondentTable,
				eq(responsesTable.respondent, respondentTable.id),
			)
			.where(
				and(
					eq(responsesTable.form, formId),
					gte(responsesTable.createdAt, sqlInterval),
				),
			)
			.groupBy(respondentTable.ip, sql`d`);

		return submissions as { count: number; date: string }[];
	} catch (e) {
		commonCatch(e);
	}
};
