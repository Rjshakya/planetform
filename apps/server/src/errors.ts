import { TaggedError } from "better-result";

export class DatabaseError extends TaggedError("DatabaseError")<{
	operation: string;
	message: string;
	cause: unknown;
}>() {
	constructor(args: { operation: string; cause: unknown }) {
		const msg =
			args.cause instanceof Error ? args.cause.message : String(args.cause);
		super({ ...args, message: `Database ${args.operation} failed: ${msg}` });
	}
}

export class ParseError extends TaggedError("ParseError")<{
	data: string;
	message: string;
	cause: unknown;
}>() {
	constructor(args: { data: string; cause: unknown }) {
		const msg =
			args.cause instanceof Error ? args.cause.message : String(args.cause);
		super({ ...args, message: `Parse failed for data: ${msg}` });
	}
}

export class ApiError extends TaggedError("ApiError")<{
	status: number;
	url: string;
	message: string;
	cause?: unknown;
}>() {}

export class NotFoundError extends TaggedError("NotFoundError")<{
	resource: string;
	id: string;
	message: string;
}>() {
	constructor(args: { resource: string; id: string }) {
		super({ ...args, message: `${args.resource} not found: ${args.id}` });
	}
}

export class ValidationError extends TaggedError("ValidationError")<{
	field: string;
	message: string;
}>() {}

export class UnhandledException extends TaggedError("UnhandledException")<{
	message: string;
	cause: unknown;
}>() {
	constructor(args: { cause: unknown }) {
		const msg =
			args.cause instanceof Error ? args.cause.message : String(args.cause);
		super({ message: `Unhandled exception: ${msg}`, cause: args.cause });
	}
}

export class NonRetryableError extends TaggedError("NonRetryableError")<{
	message: string;
	cause?: unknown;
}>() {}

export class GoogleSheetIntegrationError extends TaggedError(
	"GoogleSheetIntegration",
)<{
	operation: string;
	message: string;
	cause: unknown;
}>() {
	constructor(args: { operation: string; cause: unknown }) {
		const msg =
			args.cause instanceof Error ? args.cause.message : String(args.cause);
		super({
			...args,
			message: `GoogleSheetIntegration ${args.operation} failed: ${msg}`,
		});
	}
}

export class NotionIntegrationError extends TaggedError(
	"NotionIntegrationError",
)<{
	operation: string;
	message: string;
	cause: unknown;
}>() {
	constructor(args: { operation: string; cause: unknown }) {
		const msg =
			args.cause instanceof Error ? args.cause.message : String(args.cause);
		super({ ...args, message: `Notion ${args.operation} failed: ${msg}` });
	}
}

export class WebhookIntegrationError extends TaggedError(
	"WebhookIntegrationError",
)<{
	operation: string;
	message: string;
	cause: unknown;
}>() {
	constructor(args: { operation: string; cause: unknown }) {
		const msg =
			args.cause instanceof Error ? args.cause.message : String(args.cause);
		super({ ...args, message: `Webhook ${args.operation} failed: ${msg}` });
	}
}

export class GmailIntegrationError extends TaggedError(
	"GmailIntegrationError",
)<{
	operation: string;
	message: string;
	cause: unknown;
}>() {
	constructor(args: { operation: string; cause: unknown }) {
		const msg =
			args.cause instanceof Error ? args.cause.message : String(args.cause);
		super({ ...args, message: `Gmail ${args.operation} failed: ${msg}` });
	}
}

export class RefreshGoogleAccessTokenError extends TaggedError(
	"RefreshGoogleAccessTokenError",
)<{
	message: string;
	cause: unknown;
}>() {
	constructor(args: { cause: unknown }) {
		const msg =
			args.cause instanceof Error ? args.cause.message : String(args.cause);
		super({ ...args, message: `Google refresh access token failed: ${msg}` });
	}
}

export class IntegrationServiceError extends TaggedError(
	"IntegrationServiceError",
)<{
	operation: string;
	message: string;
	cause: unknown;
}>() {
	constructor(args: { operation: string; cause: unknown }) {
		const msg =
			args.cause instanceof Error ? args.cause.message : String(args.cause);
		super({ ...args, message: `Integration ${args.operation} failed: ${msg}` });
	}
}
