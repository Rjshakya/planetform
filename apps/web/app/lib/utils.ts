import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Route } from "../+types/root";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRootPageMetaTags: Route.MetaFunction = () => [
  { title: "Planetform" },
  {
    name: "description",
    content: "Make forms your users actually love to fill .",
  },
  { name: "application-name", content: "Planetform" },

  // ── Canonical / robots ────────────────────────────────────────────
  { tagName: "link", rel: "canonical", href: "https://planetform.xyz" },
  { name: "robots", content: "index, follow" },

  // ── Open Graph ────────────────────────────────────────────────────
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://planetform.xyz" },
  { property: "og:site_name", content: "Planetform" },
  { property: "og:title", content: "Planetform" },
  {
    property: "og:description",
    content: "Make forms your users actually love to fill .",
  },
  { property: "og:image", content: "https://planetform.xyz/og-image.png" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: "Planetform" },
  { property: "og:locale", content: "en_US" },

  // ── Twitter / X ───────────────────────────────────────────────────
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:site", content: "@planetform" }, // your handle
  { name: "twitter:creator", content: "@planetform" },
  { name: "twitter:title", content: "Planetform" },
  {
    name: "twitter:description",
    content: "Make forms your users actually love to fill .",
  },
  { name: "twitter:image", content: "https://planetform.xyz/og-image.png" },
  { name: "twitter:image:alt", content: "Planetform" },
];
