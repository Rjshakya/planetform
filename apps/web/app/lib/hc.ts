import { hcWithType } from "@planetform/server/hc";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8787";

export const client = hcWithType(baseUrl, { init: { credentials: "include" } });

export const clientUrl = import.meta.env.VITE_CLIENT_URL;
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
