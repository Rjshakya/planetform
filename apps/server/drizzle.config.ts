import "dotenv/config";

import { Config, defineConfig } from "drizzle-kit";

// "postgresql://postgres:postgres@localhost/planeformDB"
const dbUrl = process.env.DATABASE_URL;
// process.env.DATABASE_URL

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema/*",
	dialect: "postgresql",
	dbCredentials: {
		url: dbUrl,
	},
});
