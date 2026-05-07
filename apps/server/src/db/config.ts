import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as auth from "./schema/auth";
import * as form from "./schema/form";
import * as formField from "./schema/form.fields";
import * as formSetting from "./schema/form.settings";
import * as integration from "./schema/integration";
import * as respondent from "./schema/respondent";
import * as response from "./schema/response";
import * as subscription from "./schema/subscription";
import * as workspace from "./schema/workspace";

export const getDb = async () => {
	const client = new Client({
		connectionString: env.HYPERDRIVE.connectionString,
	});

	await client.connect();

	return drizzle({
		client,
		schema: {
			...auth,
			...workspace,
			...form,
			...formField,
			...formSetting,
			...respondent,
			...response,
			...integration,
			...subscription,
		},
	});
};

export const getDrizzleConfig = () => {};
