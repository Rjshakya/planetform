import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { useEffect } from "react";

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

  return {
    user: data?.user as Iuser,
    isPending,
    error,
    session: data?.session,
  };
};
