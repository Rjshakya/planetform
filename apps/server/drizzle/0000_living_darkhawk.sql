CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "custom_domain" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"formId" varchar NOT NULL,
	"cfId" text,
	"hostName" text NOT NULL,
	"status" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form" varchar(255) NOT NULL,
	"label" varchar(255) NOT NULL,
	"placeholder" varchar(255),
	"type" varchar(255),
	"subType" varchar(255),
	"order" integer NOT NULL,
	"isRequired" boolean DEFAULT false,
	"min" integer DEFAULT 1,
	"max" integer DEFAULT 1,
	"file_limit" varchar(50) DEFAULT '5mb',
	"accepted_file_types" text[],
	"choices" jsonb[],
	"multiple_select" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "form_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customisation" jsonb,
	"closed" boolean DEFAULT false,
	"closedMessage" text DEFAULT 'This form is closed.',
	"closingTime" timestamp,
	"closeAfterSubmissions" integer,
	"isPasswordProtected" boolean DEFAULT false,
	"password" text,
	"formId" text NOT NULL,
	"customerId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"workspace" uuid NOT NULL,
	"creator" text NOT NULL,
	"shortId" varchar(255),
	"form_schema" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "forms_shortId_unique" UNIQUE("shortId")
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"formId" varchar NOT NULL,
	"type" text NOT NULL,
	"metaData" text,
	"customerId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "respondents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country" text,
	"city" text,
	"ip" text,
	"longitude" text,
	"latitude" text,
	"form" varchar NOT NULL,
	"formCreatorId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_field" uuid,
	"form" varchar NOT NULL,
	"respondent" uuid NOT NULL,
	"value" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar DEFAULT 'my-work-space',
	"owner" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_domain" ADD CONSTRAINT "custom_domain_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_domain" ADD CONSTRAINT "custom_domain_formId_forms_shortId_fk" FOREIGN KEY ("formId") REFERENCES "public"."forms"("shortId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_forms_shortId_fk" FOREIGN KEY ("form") REFERENCES "public"."forms"("shortId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_settings" ADD CONSTRAINT "form_settings_formId_forms_shortId_fk" FOREIGN KEY ("formId") REFERENCES "public"."forms"("shortId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_settings" ADD CONSTRAINT "form_settings_customerId_user_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_workspace_workspaces_id_fk" FOREIGN KEY ("workspace") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_creator_user_id_fk" FOREIGN KEY ("creator") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_formId_forms_shortId_fk" FOREIGN KEY ("formId") REFERENCES "public"."forms"("shortId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_customerId_user_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respondents" ADD CONSTRAINT "respondents_form_forms_shortId_fk" FOREIGN KEY ("form") REFERENCES "public"."forms"("shortId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respondents" ADD CONSTRAINT "respondents_formCreatorId_user_id_fk" FOREIGN KEY ("formCreatorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_form_field_form_fields_id_fk" FOREIGN KEY ("form_field") REFERENCES "public"."form_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_form_forms_shortId_fk" FOREIGN KEY ("form") REFERENCES "public"."forms"("shortId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_respondent_respondents_id_fk" FOREIGN KEY ("respondent") REFERENCES "public"."respondents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "form_field_form_idx" ON "form_fields" USING btree ("form");--> statement-breakpoint
CREATE UNIQUE INDEX "short_idx" ON "forms" USING btree ("shortId");--> statement-breakpoint
CREATE INDEX "form_workspace_idx" ON "forms" USING btree ("workspace");--> statement-breakpoint
CREATE INDEX "integration_form_idx" ON "integrations" USING btree ("formId");--> statement-breakpoint
CREATE INDEX "integration_customer_idx" ON "integrations" USING btree ("customerId");--> statement-breakpoint
CREATE INDEX "respondnt_form_idx" ON "respondents" USING btree ("form");--> statement-breakpoint
CREATE INDEX "respondnt_customer_idx" ON "respondents" USING btree ("formCreatorId");--> statement-breakpoint
CREATE INDEX "responses_form_idx" ON "responses" USING btree ("form");--> statement-breakpoint
CREATE INDEX "responses_respondnt_idx" ON "responses" USING btree ("respondent");--> statement-breakpoint
CREATE INDEX "owner_idx" ON "workspaces" USING btree ("owner");