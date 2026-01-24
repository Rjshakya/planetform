import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { Logo } from "../components/common/Logo";
import SignIn from "./_components/SignIn";

export default function AuthPage() {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className=" grid place-content-center min-h-screen w-full">
        <Loader className=" animate-spin" />
      </div>
    );
  }

  if (!isPending && data?.session?.id) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <main className="grid min-h-screen p-2 lg:grid-cols-2 gap-4">
      <div className=" hidden  lg:flex items-center justify-center ">
        <div className="w-full h-full relative rounded-2xl">
          <img
            src="/auth3.jpg"
            alt="auth-img"
            className="w-full h-full rounded-2xl absolute object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 md:3 md:px-8 rounded-2xl">
        <div className="flex gap-2 justify-start">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center mt-12">
          <div className="w-full max-w-md  ">
            <SignIn />
          </div>
        </div>
      </div>
    </main>
  );
}
