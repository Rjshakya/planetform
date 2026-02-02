import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { client } from "./hc";

const baseUrl = import.meta.env.VITE_BACKEND_URL as string;
const clientUrl = import.meta.env.VITE_CLIENT_URL as string;

export const authClient = createAuthClient({
  baseURL: baseUrl,
  plugins: [
    inferAdditionalFields({
      user: {
        dodoCustomerId: { type: "string" },
      },
    }),
  ],
});
export const signIn = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: `${clientUrl}/dashboard`,
    requestSignUp: true,
  });
};

export const signOut = async () => {
  await authClient.signOut({});
};

export const linkGoogleSheet = async (callbackURL: string) => {
  await authClient.linkSocial({
    provider: "google",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    callbackURL,
  });
};

export const linkGmail = async (callbackURL: string) => {
  await authClient.linkSocial({
    provider: "google",
    scopes: ["https://www.googleapis.com/auth/gmail.send"],
    callbackURL,
  });
};

export const linkNotion = async (callbackURL: string) => {
  await authClient.linkSocial({
    provider: "notion",
    callbackURL,
  });
};

export const linkSlack = async (callbackURL: string) => {
  const res = await client.api.integration.slack.auth.$post({
    json: {
      scopes: ["channels:read", "chat:write", "chat:write.public"],
      callBackUrl: callbackURL,
    },
  });

  if (!res.ok) throw new Error("failed to link");

  const data = await res.json();
  const width = 600;
  const height = 700;

  // 2. Calculate center position
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  // 3. Open the popup instead of redirecting the current tab
  const popup = window.open(
    new URL(data.url), // This is the Slack auth URL from your server
    "slack-auth",
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`,
  );

  // 4. (Optional) Focus the popup if it was blocked/hidden
  if (popup) popup.focus();
};
