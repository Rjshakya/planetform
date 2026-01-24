import { eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { formSetting as formSettingTable } from "../db/schema/form.settings";
import { commonCatch } from "../utils/error";

export const createFormSettingService = async (
	values: typeof formSettingTable.$inferInsert,
) => {
	try {
		const db = await getDb();
		const [settings] = await db
			.insert(formSettingTable)
			.values(values)
			.returning();
		return settings;
	} catch (e) {
		commonCatch(e);
	}
};

export const updateFormSettingService = async (
	values: typeof formSettingTable.$inferInsert,
) => {
	try {
		const db = await getDb();
		const [setting] = await db
			.update(formSettingTable)
			.set(values)
			.where(eq(formSettingTable.formId, values?.formId))
			.returning();

		return setting;
	} catch (e) {
		commonCatch(e);
	}
};

export const getFormSettingService = async (formId: string) => {
	try {
		const db = await getDb();
		const [settings] = await db
			.select()
			.from(formSettingTable)
			.where(eq(formSettingTable.formId, formId));
		return settings;
	} catch (e) {
		commonCatch(e);
	}
};
