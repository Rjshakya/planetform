import { Result } from "better-result";
import { OAuth2Client } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { GoogleSheetIntegrationError } from "../../errors";
import { refreshGoogleAccessToken } from "../../utils/refresh-token";

export interface IGoogleSheetServiceParams {
	accessToken: string;
	refreshToken: string;
	userID: string;
}

export class GoogleSheetService {
	private accessToken: string;
	private refreshToken: string;
	userID: string;
	private auth: OAuth2Client;

	constructor(params: IGoogleSheetServiceParams) {
		const { accessToken, refreshToken, userID } = params;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.userID = userID;

		this.auth = new OAuth2Client({
			credentials: { access_token: accessToken, refresh_token: refreshToken },
		});
	}

	/**
	 *
	 * @param title
	 * @returns GoogleSpreadsheet
	 */
	async createSheet(title: string) {
		return Result.tryPromise({
			try: async () => {
				const sheet = await GoogleSpreadsheet.createNewSpreadsheetDocument(
					this.auth,
					{ title },
				);

				return sheet;
			},
			catch: (e) => this.error({ cause: e, operation: "createSheet" }),
		});
	}

	/**
	 *
	 * @param spreadSheetId string
	 * @param headerValues string[]
	 * @returns Result<boolean , Error>
	 *
	 */
	async setHeader(spreadSheetId: string, headerValues: string[]) {
		return Result.tryPromise({
			try: async () => {
				const doc = new GoogleSpreadsheet(spreadSheetId, this.auth);
				await doc.loadInfo();

				const sheet = await doc.sheetsByIndex[0];
				await sheet.setHeaderRow(headerValues);
				return true;
			},
			catch: (e) => this.error({ cause: e, operation: "createSheet" }),
		});
	}

	/**
	 *
	 * @param spreadsheetId
	 * @param row  it can't be a string , either a object or Array
	 * @returns rowNumber
	 */
	async addRow(spreadsheetId: string, row: Record<string, string> | string[]) {
		return Result.tryPromise({
			try: async () => {
				const doc = new GoogleSpreadsheet(spreadsheetId, this.auth);
				await doc.loadInfo();
				const sheet = doc.sheetsByIndex[0];
				await sheet.loadHeaderRow();
				const res = await sheet.addRow(row);
				await res.save();
				return res.rowNumber;
			},
			catch: (e) => this.error({ cause: e, operation: "addRow" }),
		});
	}

	/**
	 *
	 * @param spreadsheetId
	 * @param rows
	 * @returns length (number)
	 */
	async addRows(spreadsheetId: string, rows: any[]) {
		return Result.tryPromise({
			try: async () => {
				const doc = new GoogleSpreadsheet(spreadsheetId, this.auth);
				await doc.loadInfo();
				const sheet = doc.sheetsByIndex[0];
				await sheet.loadHeaderRow();
				const res = await sheet.addRows(rows);
				return res.length;
			},
			catch: (e) => this.error({ cause: e, operation: "addRows" }),
		});
	}

	/**
	 * List all sheets in a spreadsheet
	 * @param spreadsheetId
	 * @returns array of sheet info
	 */
	async listSheets(spreadsheetId: string) {
		return Result.tryPromise({
			try: async () => {
				const doc = new GoogleSpreadsheet(spreadsheetId, this.auth);
				await doc.loadInfo();
				return doc.sheetsByIndex.map((sheet) => ({
					index: sheet.index,
					title: sheet.title,
					sheetId: sheet.sheetId,
					rowCount: sheet.rowCount,
					columnCount: sheet.columnCount,
				}));
			},
			catch: (e) => this.error({ cause: e, operation: "listSheets" }),
		});
	}

	/**
	 * Create a new sheet within an existing spreadsheet
	 * @param spreadsheetId
	 * @param title
	 * @returns the new sheet
	 */
	async createSheetInSpreadsheet(spreadsheetId: string, title: string) {
		return Result.tryPromise({
			try: async () => {
				const doc = new GoogleSpreadsheet(spreadsheetId, this.auth);
				await doc.loadInfo();
				const sheet = await doc.addSheet({ title });
				return sheet;
			},
			catch: (e) =>
				this.error({ cause: e, operation: "createSheetInSpreadsheet" }),
		});
	}

	/**
	 * Delete a sheet from a spreadsheet
	 * @param spreadsheetId
	 * @param sheetIndex
	 */
	async deleteSheet(spreadsheetId: string, sheetIndex: number) {
		return Result.tryPromise({
			try: async () => {
				const doc = new GoogleSpreadsheet(spreadsheetId, this.auth);
				await doc.loadInfo();
				const sheet = doc.sheetsByIndex[sheetIndex];
				if (!sheet) throw new Error(`Sheet at index ${sheetIndex} not found`);
				await sheet.delete();
				return true;
			},
			catch: (e) => this.error({ cause: e, operation: "deleteSheet" }),
		});
	}

	/**
	 * Update existing row data
	 * @param spreadsheetId
	 * @param rowIndex 0-based
	 * @param data object with column headers as keys
	 */
	async updateRow(spreadsheetId: string, rowIndex: number, data: any) {
		return Result.tryPromise({
			try: async () => {
				const doc = new GoogleSpreadsheet(spreadsheetId, this.auth);
				await doc.loadInfo();
				const sheet = doc.sheetsByIndex[0];
				await sheet.loadHeaderRow();
				const rows = await sheet.getRows();
				if (rowIndex >= rows.length)
					throw new Error(`Row ${rowIndex} does not exist`);
				Object.assign(rows[rowIndex], data);
				await rows[rowIndex].save();
				return rows[rowIndex].rowNumber;
			},
			catch: (e) => this.error({ cause: e, operation: "updateRow" }),
		});
	}

	/**
	 * standard error
	 * @param args
	 * @returns
	 */
	private error(args: { operation: string; cause: unknown }) {
		return new GoogleSheetIntegrationError(args);
	}
}
