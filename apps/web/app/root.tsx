import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

import { SWRConfig } from "swr";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/components/common/theme-provider";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/planetform-icon.svg" },
]


export const meta: Route.MetaFunction = () => [
  // ── Core ──────────────────────────────────────────────────────────
  { title: "Planetform" },
  { name: "description", content: "Make forms your users actually love to fill ." },
  { name: "application-name", content: "Planetform" },

  // ── Canonical / robots ────────────────────────────────────────────
  { tagName: "link", rel: "canonical", href: "https://planetform.xyz" },
  { name: "robots", content: "index, follow" },

  // ── Open Graph ────────────────────────────────────────────────────
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://planetform.xyz" },
  { property: "og:site_name", content: "Planetform" },
  { property: "og:title", content: "Planetform" },
  { property: "og:description", content: "Make forms your users actually love to fill ." },
  { property: "og:image", content: "https://planetform.xyz/og-image.png" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: "Planetform" },
  { property: "og:locale", content: "en_US" },

  // ── Twitter / X ───────────────────────────────────────────────────
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:site", content: "@planetform" },       // your handle
  { name: "twitter:creator", content: "@planetform" },
  { name: "twitter:title", content: "Planetform" },
  { name: "twitter:description", content: "Make forms your users actually love to fill ." },
  { name: "twitter:image", content: "https://planetform.xyz/og-image.png" },
  { name: "twitter:image:alt", content: "Planetform" },

];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} richColors position="top-right" />;
}

export default function App() {
  return (
    <SWRConfig>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Outlet />
          <ThemedToaster />
        </TooltipProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
