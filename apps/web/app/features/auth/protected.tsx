import { useUser } from "@/hooks/use-user";
import { Navigate, Outlet } from "react-router";

export default function Protected() {
  const { isPending, session } = useUser();

  if (!isPending && !session?.id) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
