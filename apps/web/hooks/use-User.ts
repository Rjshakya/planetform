"use client";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";

interface Iuser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  dodoCustomerId: string;
}

export const useUser = () => {
  const { data, error, isPending } = authClient.useSession();
  if (!isPending && !data) {
    return redirect("/auth");
  }

  return { user: data?.user as Iuser, isPending, error };
};
