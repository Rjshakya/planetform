import {
	Client,
	type CreateDatabaseParameters,
	type CreatePageParameters,
	type GetDatabaseParameters,
	type GetPageParameters,
	type GetPagePropertyParameters,
	type SearchParameters,
	type UpdateDatabaseParameters,
	type UpdatePageParameters,
} from "@notionhq/client";
import { Result } from "better-result";
import { NotionIntegrationError } from "../../errors.js";

export interface INotionServiceParams {
	token: string;
}

export type PageProperties = CreatePageParameters["properties"];

export class NotionIntegrationService {
	private client: Client;
	token: string;

	constructor(params: INotionServiceParams) {
		const { token } = params;
		this.token = token;
		this.client = new Client({ auth: token, fetch: fetch.bind(globalThis) });
	}

	private error(args: {
		operation: string;
		cause: unknown;
	}): NotionIntegrationError {
		return new NotionIntegrationError(args);
	}

	/**
	 * Create a new database
	 * @param params - Database creation parameters
	 */
	async createDatabase(params: CreateDatabaseParameters) {
		return Result.tryPromise({
			try: async () => {
				return await this.client.databases.create(params);
			},
			catch: (e) => this.error({ operation: "createDatabase", cause: e }),
		});
	}

	/**
	 * Search for databases
	 * @param SearchParameters
	 * @returns
	 */
	async search(params: SearchParameters) {
		return Result.tryPromise({
			try: async () => {
				return await this.client.search(params);
			},
			catch: (e) => this.error({ operation: "search", cause: e }),
		});
	}

	/**
	 * Update database properties
	 * @param databaseId - The ID of the database
	 * @param params - Update parameters
	 */
	async updateDatabase(params: UpdateDatabaseParameters) {
		return Result.tryPromise({
			try: async () => {
				return await this.client.databases.update(params);
			},
			catch: (e) => this.error({ operation: "updateDatabase", cause: e }),
		});
	}

	/**
	 * Delete (archive) a database
	 * @param databaseId - The ID of the database
	 */
	async deleteDatabase(databaseId: string) {
		return Result.tryPromise({
			try: async () => {
				return await this.client.databases.update({
					database_id: databaseId,
					in_trash: true,
				});
			},
			catch: (e) => this.error({ operation: "deleteDatabase", cause: e }),
		});
	}

	/**
	 * Get database info
	 * @param databaseId - The ID of the database
	 */
	async getDatabase(params: GetDatabaseParameters) {
		return Result.tryPromise({
			try: async () => {
				return await this.client.databases.retrieve(params);
			},
			catch: (e) => this.error({ operation: "getDatabase", cause: e }),
		});
	}

	/**
	 *  put database-Id as parent
	 * @param params
	 * @returns
	 */
	async insertInDatabase(databaseId: string, properties: PageProperties) {
		return await this.createPage({
			parent: { database_id: databaseId },
			properties,
		});
	}

	/**
	 *
	 * @param params
	 * @returns
	 */
	async createPage(params: CreatePageParameters) {
		return Result.tryPromise({
			try: async () => {
				return await this.client.pages.create(params);
			},
			catch: (e) => this.error({ operation: "createPage", cause: e }),
		});
	}

	/**
	 *
	 * @param params
	 * @returns
	 */
	async getPage(params: GetPageParameters) {
		return Result.tryPromise({
			try: async () => {
				return await this.client.pages.retrieve(params)
			},
			catch: (e) => this.error({ operation: "getPage", cause: e }),
		});
	}

	/**
	 *
	 * @param params
	 * @returns
	 */
	async updatePage(params: UpdatePageParameters) {
		return Result.tryPromise({
			try: async () => {
				return await this.client.pages.update(params)
			},
			catch: (e) => this.error({ operation: "updatePage", cause: e }),
		});
	}

	/**
	 *
	 * @param pageId
	 * @returns
	 */
	async deletePage(pageId: string) {
		return Result.tryPromise({
			try: async () => {

        

				return await this.client.pages.update({
					page_id: pageId,
					archived: true,
				});
			},
			catch: (e) => this.error({ operation: "deletePage", cause: e }),
		});
	}

	/**
	 *
	 * @param params
	 * @returns
	 */
	async getPageProperties(params: GetPagePropertyParameters) {
		return Result.tryPromise({
			try: async () => {
				return await this.client.pages.properties.retrieve(params);
			},
			catch: (e) => this.error({ operation: "deletePage", cause: e }),
		});
	}
}
