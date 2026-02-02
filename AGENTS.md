# Agent Guidelines for Planteform Monorepo

This repository is a Turborepo monorepo with a React frontend and Hono backend.

## Build Commands

```bash
# Root level (runs via Turbo)
pnpm run build          # Build all apps
pnpm run dev            # Start dev servers for all apps
pnpm run lint           # Lint all apps
pnpm run format         # Format code with Prettier
pnpm run check-types    # Type check all apps

# React app (apps/react/)
pnpm run dev            # Start Vite dev server
pnpm run build          # Production build
pnpm run lint           # ESLint check
pnpm run preview        # Preview production build
pnpm run deploy         # Deploy to Cloudflare Pages

# Server app (apps/server/)
pnpm run dev            # Start Wrangler dev server (port 8000)
pnpm run build          # Compile TypeScript
pnpm run deploy         # Deploy to Cloudflare Workers
pnpm run cf-typegen     # Generate Cloudflare types
```

## Lint/Format Commands

```bash
# Root: Prettier for formatting
pnpm run format         # Format all files

# React app: ESLint
pnpm run lint           # Run ESLint

# Server app: Biome
pnpm run lint           # Biome check (runs via biome.json)
```

## Testing Commands

**Note: No test runner is currently configured.** The codebase has no tests. If adding tests:

- React: Consider Vitest or Jest
- Server: Consider Vitest for Hono routes

## Code Style Guidelines

### Import Ordering

1. External libraries (React, Hono, Zod, etc.)
2. Third-party UI libraries (lucide-react, sonner)
3. Internal aliases (`@/hooks`, `@/components`, `@/lib`)
4. Relative imports (`../`, `./`)

### Formatting

- **React app**: 2 spaces, 80 char line width, Prettier
- **Server app**: Tabs, Biome formatter with organize imports enabled
- Always use semicolons
- Use double quotes for strings

### Naming Conventions

| Type             | Convention                  | Example                       |
| ---------------- | --------------------------- | ----------------------------- |
| React Components | PascalCase                  | `DashboardHome`, `AppSidebar` |
| Component Files  | camelCase/PascalCase        | `home.tsx`, `Logo.tsx`        |
| Hooks            | camelCase, prefix `use`     | `useUser`, `useForm`          |
| Hook Files       | kebab-case                  | `use-user.ts`, `use-form.ts`  |
| Services         | camelCase, suffix `Service` | `createFormService`           |
| Zustand Stores   | camelCase, prefix `use`     | `useFormStore`                |
| Types/Interfaces | PascalCase                  | `IUser`, `Form`, `Workspace`  |
| API Routes       | camelCase                   | `form.ts`, `workspace.ts`     |

### TypeScript Conventions

- Use strict mode enabled
- Prefer explicit return types on exported functions
- Use `type` over `interface` for simple shapes
- Prefix interfaces with `I` (e.g., `IUser`, `IForm`)
- Avoid `any` - use `unknown` or proper types
- Use path aliases (`@/`) instead of relative imports for cross-module imports

### Error Handling

**Server**: Use `better-result` with `TaggedError`:

```typescript
export class DatabaseError extends TaggedError("DatabaseError")<{
  operation: string;
  message: string;
  cause: unknown;
}>() {}

// In services
return Result.tryPromise({
  try: async () => {
    /* logic */
  },
  catch: (e) => new DatabaseError({ operation: "createForm", cause: e }),
});
```

**React**: Return errors from hooks, handle in components with SWR and toast notifications.

### API Patterns

**Server (Hono)**:

```typescript
const route = new Hono<{ Variables: { userId: string } }>().post(
  "/",
  authMiddleware,
  zValidator("json", schema),
  async (c) => {
    const result = await serviceCall();
    if (Result.isOk(result)) {
      return c.json(result.value, 200);
    }
    return c.json(result.error, 400);
  },
);
```

**React (SWR)**:

```typescript
export const useUserWorkspace = (userId: string) => {
  const { data, error, isLoading } = useSWR(
    userId ? `useUserWorkspace:${userId}` : null,
    fetcher,
  );
  return { workspaces: data, error, isLoading };
};
```

### Database (Drizzle ORM)

- Define schemas in `src/db/schema/`
- Use relations for foreign keys
- Use Zod schemas with `drizzle-zod` for validation

## Project Structure

```
apps/react/       # React SPA (Vite + Tailwind + shadcn/ui)
apps/server/      # Hono API (Cloudflare Workers + Drizzle)
packages/         # Shared packages (currently empty)
```

## Key Technologies

- **Frontend**: React 19, React Router 7, Tailwind CSS 4, shadcn/ui, Zustand, SWR
- **Backend**: Hono, Cloudflare Workers, Drizzle ORM, PostgreSQL
- **Auth**: Better-Auth (Dodopayments fork)
- **Validation**: Zod
- **Package Manager**: pnpm 9.0.0
- **Build**: Turborepo, Vite (Rolldown variant)

## Environment Requirements

- Node.js >= 18
- pnpm 9.0.0
