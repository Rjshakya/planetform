import { authClient } from "./auth-client";

export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  dodoCustomerId: string;
}

export async function requireAuth(): Promise<IUser> {
  const res = await authClient.getSession();
  if (!res.data?.session?.id) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return res.data.user as IUser;
}
