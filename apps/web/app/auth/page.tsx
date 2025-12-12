"use client";
import Image from "next/image";
import SignIn from "./_components/SignIn";
import {  Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import authImg from "@/public/auth3.jpg";
import { Logo } from "@/components/Logo";

export default function AuthPage() {
  const { data, isPending } = authClient.useSession();

  if (data?.session?.id) {
    redirect("/dashboard");
  }

  if (isPending) {
    return (
      <div className=" grid place-content-center min-h-screen w-full">
        <Loader className=" animate-spin" />
      </div>
    );
  }

  return (
    <main className="grid min-h-screen p-2 lg:grid-cols-2 gap-4">
      <div className=" hidden  lg:flex items-center justify-center ">
        <div className="w-full h-full relative rounded-2xl">
          <Image
            src={authImg}
            alt="Image"
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
