# Planetform

A modern, beautiful form builder SaaS built with React, Hono, and Cloudflare. Create customizable forms your users actually love to fill.

## Overview

Planetform is a full-stack form builder application deployed on Cloudflare's edge network. It features a rich Tiptap-based form editor, custom domain support, advanced integrations, real-time analytics, and a Polar.sh-powered billing system.

## Architecture

This repository is a [Turborepo](https://turbo.build/) monorepo containing:

- **`apps/web`** — React frontend (React Router 7 + Vite + Cloudflare Pages)
- **`apps/server`** — Hono API backend (Cloudflare Workers)

## Tech Stack

### Frontend (`apps/web`)

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| React Router 7 | Routing & SSR |
| Vite (Rolldown) | Build tool |
| Tailwind CSS 4 | Styling |
| shadcn/ui + Radix | UI components |
| Tiptap | Rich text / form block editor |
| Zustand | State management |
| SWR | Data fetching & caching |
| Better-Auth (client) | Authentication |
| Recharts | Analytics charts |
| Motion | Animations |

### Backend (`apps/server`)

| Technology | Purpose |
|-----------|---------|
| Hono | Web framework |
| Cloudflare Workers | Serverless runtime |
| Drizzle ORM | Database ORM |
| PostgreSQL (via Hyperdrive) | Primary database |
| Better-Auth | Authentication |
| Polar.sh | Subscription billing |
| Cloudflare KV | Edge caching |
| Cloudflare Queues | Async integration jobs |
| Cloudflare Workflows | Durable integration execution |
| Cloudflare Rate Limiting | API throttling |

## Project Structure

```
planetform/
├── apps/
│   ├── web/                    # React SPA (Vite + React Router 7)
│   │   ├── app/
│   │   │   ├── components/     # Reusable UI components (shadcn/ui)
│   │   │   ├── features/       # Route-level features
│   │   │   │   ├── marketing/    # Landing page
│   │   │   │   ├── auth/         # Sign-in / protected routes
│   │   │   │   ├── dashboard/    # Dashboard layout
│   │   │   │   ├── workspace/    # Workspace management
│   │   │   │   ├── editor/       # Form editor
│   │   │   │   ├── edit-form/    # Form editing route
│   │   │   │   ├── form/         # Public form rendering
│   │   │   │   ├── form-manage/  # Submissions / analytics / integrations / embed / settings
│   │   │   │   ├── submissions/  # Form response table
│   │   │   │   ├── analytics/    # Form analytics
│   │   │   │   ├── integrations/ # Integration configuration
│   │   │   │   ├── embed/        # Embed code generator
│   │   │   │   ├── form-settings/# Close, password, scheduling
│   │   │   │   ├── custom-domain/# Custom domain management
│   │   │   │   ├── billing/      # Subscription & checkout
│   │   │   │   ├── pricing/      # Public pricing page
│   │   │   │   └── preview/      # Form preview
│   │   │   ├── hooks/            # SWR hooks & feature gates
│   │   │   ├── stores/           # Zustand stores
│   │   │   ├── lib/              # Utilities (auth client, axios, helpers)
│   │   │   ├── routes.ts         # Route definitions
│   │   │   ├── root.tsx          # Root layout with meta tags
│   │   │   └── entry.server.tsx  # SSR entry
│   │   ├── worker/app.ts         # Cloudflare Worker entry
│   │   ├── public/               # Static assets
│   │   └── wrangler.jsonc        # Cloudflare Pages config
│   └── server/                 # Hono API (Cloudflare Workers)
│       ├── src/
│       │   ├── app.ts            # Hono app setup, CORS, rate limiting, auth
│       │   ├── hc.ts             # Hono client types
│       │   ├── api/              # Route handlers
│       │   │   ├── index.ts      # API router aggregation
│       │   │   ├── workspace.ts
│       │   │   ├── form.ts
│       │   │   ├── form.field.ts
│       │   │   ├── respondent.ts
│       │   │   ├── response.ts
│       │   │   ├── integration.ts
│       │   │   ├── file.upload.ts
│       │   │   ├── subscription.ts
│       │   │   ├── billing.ts
│       │   │   ├── analytics.ts
│       │   │   └── custom.domain.ts
│       │   ├── services/         # Business logic services
│       │   │   ├── form.ts
│       │   │   ├── form.field.ts
│       │   │   ├── form.setting.ts
│       │   │   ├── workspace.ts
│       │   │   ├── integration.ts
│       │   │   ├── respondent.ts
│       │   │   ├── response.ts
│       │   │   ├── subscription.ts
│       │   │   ├── file.upload.ts
│       │   │   ├── dashboard.analytics.ts
│       │   │   ├── form.analytics.ts
│       │   │   ├── custom.domain.ts
│       │   │   ├── cloudflare.ts
│       │   │   ├── google/
│       │   │   │   ├── gmail.ts
│       │   │   │   └── sheet.ts
│       │   │   ├── notion/
│       │   │   │   └── notion.ts
│       │   │   ├── polar/
│       │   │   │   ├── customer.ts
│       │   │   │   ├── events.ts
│       │   │   │   └── products.ts
│       │   │   ├── slack/
│       │   │   │   ├── index.ts
│       │   │   │   ├── oauth.ts
│       │   │   │   └── slack.ts
│       │   │   ├── webhook/
│       │   │   │   └── webhook.ts
│       │   │   └── zepto-mail/
│       │   │       └── mail.ts
│       │   ├── db/
│       │   │   ├── config.ts     # Drizzle client & repository helper
│       │   │   └── schema/
│       │   │       ├── auth.ts
│       │   │       ├── workspace.ts
│       │   │       ├── form.ts
│       │   │       ├── form.fields.ts
│       │   │       ├── form.settings.ts
│       │   │       ├── respondent.ts
│       │   │       ├── response.ts
│       │   │       ├── integration.ts
│       │   │       ├── custom-domain.ts
│       │   │       └── index.ts
│       │   ├── middlewares/
│       │   │   ├── authMiddleware.ts
│       │   │   └── billingGates.ts
│       │   ├── billing/
│       │   │   ├── index.ts
│       │   │   ├── types.ts
│       │   │   ├── customer.ts
│       │   │   ├── events.ts
│       │   │   └── webhooks.ts
│       │   ├── queues/
│       │   │   └── integration-queue.ts
│       │   ├── workflows/
│       │   │   ├── index.ts
│       │   │   ├── customer.ts
│       │   │   ├── email.ts
│       │   │   ├── gmail.ts
│       │   │   ├── google-sheet.ts
│       │   │   ├── notion.ts
│       │   │   ├── slack.ts
│       │   │   ├── webhook.ts
│       │   │   └── helpers.ts
│       │   ├── utils/
│       │   │   ├── auth.ts
│       │   │   ├── api.ts
│       │   │   ├── cache.ts
│       │   │   ├── cache-keys.ts
│       │   │   ├── redis.ts
│       │   │   ├── error.ts
│       │   │   ├── logger.ts
│       │   │   ├── mail.ts
│       │   │   ├── sendEmail.ts
│       │   │   ├── getHtmlEmail.ts
│       │   │   ├── refresh-token.ts
│       │   │   ├── subscription.ts
│       │   │   ├── time.ts
│       │   │   ├── validation.ts
│       │   │   └── breakIntegration.ts
│       │   └── errors.ts
│       └── wrangler.jsonc        # Cloudflare Workers config
├── package.json                  # Root package (Turborepo)
├── turbo.json                    # Turborepo pipeline
└── pnpm-workspace.yaml           # pnpm workspace definition
```

## Features

### Core Form Builder
- **Tiptap-powered editor** — Rich block-based form editor with drag-and-drop
- **Form nodes** — Short input, long input, email, multiple choice, date picker, file upload, page breaks, field references
- **Real-time preview** — See exactly how your form looks as you build it
- **Customization panel** — Full theme control: colors, fonts, layout, button styles, dark mode support
- **Multi-page forms** — Page break nodes for multi-step forms

### Form Settings
- **Close form** — Manual close with custom message
- **Scheduled closing** — Auto-close at a specific date/time
- **Submission limits** — Auto-close after N submissions
- **Password protection** — JWT-based password gating

### Custom Domains
- Host forms on your own domain (e.g., `forms.yourcompany.com`)
- Cloudflare DNS validation & CNAME records
- Automatic SSL via Cloudflare

### Integrations
When a form is submitted, integrations are triggered asynchronously via Cloudflare Queues + Workflows:

| Integration | Description |
|-------------|-------------|
| **Google Sheets** | Append responses to a Google Spreadsheet |
| **Gmail** | Send emails via Gmail API |
| **Notion** | Create database entries in Notion |
| **Slack** | Post messages to Slack channels |
| **Webhook** | POST form data to any external URL |
| **Email Notification** | Notify form owner on submission |
| **Email to Respondent** | Auto-reply to the respondent |

### Analytics
- Submission counts over time
- Response rate tracking
- Per-form and dashboard-level analytics
- Visualized with Recharts

### Billing (Polar.sh)
- **Free plan** — Limited workspaces, forms, responses
- **Pro plan** — Unlimited workspaces, forms, custom domains, advanced analytics, integrations
- Checkout via Polar hosted pages
- Webhook-driven subscription state sync
- Usage-based metering for responses, emails, file uploads

### Auth
- Google OAuth sign-in
- Account linking for Google, Notion, Slack
- Session management with cookie caching
- Rate-limited auth endpoints

## Database Schema

### Entities

- **`user`** — Better-Auth managed users
- **`session`** — Better-Auth sessions
- **`account`** — OAuth account links (Google, Notion, Slack)
- **`workspace`** — User workspaces (owner-scoped)
- **`form`** — Forms (linked to workspace, has shortId for public URLs)
- **`formField`** — Extracted form fields for querying/filtering responses
- **`formSetting`** — Close settings, password protection, customization JSON
- **`respondent`** — Individual form submitters
- **`response`** — Per-field submitted values
- **`integration`** — Connected integrations per form
- **`customDomain`** — Custom domain records with DNS status

### Relationships

```
user ──owns──► workspace ──has──► form
                              ├──► formField
                              ├──► formSetting
                              ├──► respondent ──has──► response
                              ├──► integration
                              └──► customDomain
```

## API Architecture

The backend uses **Hono** with a layered architecture:

```
app.ts (CORS, Rate Limiting, Auth, Logging)
  └── api/index.ts (route aggregation)
        ├── /workspace     → workspace.ts     → workspaceService
        ├── /form          → form.ts          → formService
        ├── /formField     → form.field.ts    → formFieldService
        ├── /respondent    → respondent.ts    → respondentService
        ├── /response      → response.ts      → responseService
        ├── /integration   → integration.ts   → integrationService
        ├── /file          → file.upload.ts   → fileUploadService
        ├── /subscription  → subscription.ts  → subscriptionService
        ├── /billing       → billing.ts       → billingService
        ├── /analytics     → analytics.ts     → analyticsService
        └── /customDomain  → custom.domain.ts → customDomainService
```

### Middleware Pipeline

1. **CORS** — Public routes echo origin; protected routes restrict to trusted domain
2. **Rate Limiting** — Cloudflare Rate Limits per path (except form submissions)
3. **Auth** — `/api/auth/*` handled by Better-Auth
4. **Logging** — Structured logs with `hono-wide-logger`
5. **Auth Middleware** — Validates session, sets `userId` on context
6. **Billing Gates** — Checks plan limits before allowing create operations

### Error Handling

The server uses `better-result` with `TaggedError` for type-safe errors:

- `DatabaseError` — DB operation failures
- `IntegrationServiceError` — Integration failures
- `BillingError` / `PolarApiError` — Billing failures
- `ParseError` — JSON parsing failures
- `UnhandledException` — Catch-all

## Integrations Architecture

Form submissions trigger an **async pipeline**:

1. **Queue** — `planetform-integrations-queue` receives a message with form data
2. **Workflow** — A Cloudflare Workflow picks up the message and executes integrations
3. **Retries** — Workflows provide automatic retries and durability
4. **Break circuit** — `breakIntegration.ts` stops retries after repeated failures

### Workflow Types

| Workflow | Trigger | Action |
|----------|---------|--------|
| `CustomerOnboardingWorkflow` | User sign-up | Welcome email via ZeptoMail |
| `EmailIntegrationWorkflow` | Form submission | Send email notifications |
| `GmailIntegrationWorkflow` | Form submission | Send Gmail via Google API |
| `GoogleSheetIntegrationWorkflow` | Form submission | Append to Google Sheet |
| `NotionIntegrationWorkflow` | Form submission | Create Notion page |
| `SlackIntegrationWorkflow` | Form submission | Post to Slack channel |
| `WebHookIntegrationWorkflow` | Form submission | POST to external webhook |

## Development

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

#### Web App (`apps/web/.env`)

```env
VITE_BACKEND_URL=http://localhost:8787
VITE_CLIENT_URL=http://localhost:3000
```

#### Server (`apps/server/.env`)

```env
FRONTEND_URL=http://localhost:3000
TRUSTED_DOMAIN=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NOTION_CLIENT_ID=...
NOTION_CLIENT_SECRET=...
SLACK_CLIENT_ID=...
SLACK_CLIENT_SECRET=...
POLAR_ACCESS_TOKEN=...
POLAR_WEBHOOK_SECRET=...
PRO_PLAN_PRODUCT_ID=...
JWT_SECRET=...
PLANETFORM_EMAIL_NOTIFICATION_ADDRESS=...
ZEPTOMAIL_TOKEN=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### Running Locally

```bash
# Root — starts both apps via Turbo
pnpm run dev

# Web app only (port 3000)
cd apps/web
pnpm run dev

# Server only (port 8000)
cd apps/server
pnpm run dev
```

### Database

```bash
cd apps/server

# Push schema changes
pnpm run db:push

# Open Drizzle Studio
pnpm run db:studio
```

### Build

```bash
# Root — builds all apps
pnpm run build

# Check types across monorepo
pnpm run check-types
```

### Lint & Format

```bash
# Format all files (Prettier)
pnpm run format

# Lint all apps (ESLint + Biome via Turbo)
pnpm run lint
```

## Deployment

Both apps deploy to **Cloudflare**:

- **Web** — Cloudflare Pages (`planetform.xyz`)
- **Server** — Cloudflare Workers (`api.planetform.xyz`)

### Deploy Web

```bash
cd apps/web
pnpm run deploy
```

### Deploy Server

```bash
cd apps/server
pnpm run deploy
```

### Secrets

```bash
cd apps/server
pnpm run secret   # bulk upload from .env.production
```

## Key Design Decisions

### Edge-First Architecture
Everything runs on Cloudflare's edge — Pages, Workers, KV, Queues, Workflows, Hyperdrive, and Rate Limits. This means:
- Sub-latency API responses globally
- No server management
- Automatic scaling

### Tiptap as Form Builder
Instead of a rigid form builder, Planetform uses Tiptap (a ProseMirror-based rich text editor) with custom form nodes. This enables:
- Free-form layout (mix text, images, and inputs)
- Drag-and-drop reordering
- Rich content alongside form fields
- Multi-page forms via page break nodes

### Better-Auth + Polar
Authentication and billing are tightly coupled:
- `better-auth` handles OAuth and sessions
- `@polar-sh/better-auth` plugin auto-creates Polar customers, handles checkout, portal, usage, and webhooks
- Webhooks sync subscription state into the app

### Async Integrations via Queues + Workflows
Integrations are decoupled from the submission path:
- The API responds immediately to the user
- A Queue message triggers a durable Workflow
- Workflows handle retries, rate limiting, and failures

### Caching Strategy
- **KV** — Form public data cached at the edge (60s TTL)
- **Redis (Upstash)** — User forms, form fields cached for dashboard speed
- **Cookie cache** — Auth sessions cached client-side for 6 minutes

## License

Private — All rights reserved.
