import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

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
  await authClient.linkSocial({
    provider: "slack",
    callbackURL,
  });
};
