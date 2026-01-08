import React, { JSX, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/axios";
import useSWR, { mutate } from "swr";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export const IntegrationCard = ({
  provider,
  workspaceId,
  formId,
  customerId,
  description,
  i,
  isComingSoon,
  addOnBtn,
  icon,
}: {
  provider: string;
  workspaceId: string;
  formId: string;
  i: number;
  customerId: string;
  description: string;
  isComingSoon?: boolean;
  addOnBtn?: {
    text: string;
    handleClick: (
      data: any,
      formId: string,
      customerId: string
    ) => Promise<void>;
  };
  icon: JSX.Element;
}) => {
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL as string;
  const router = useRouter();
  const handleConnect = async () => {
    if (provider === "Google") {
      await authClient.linkSocial({
        provider: "google",
        scopes: [
          "https://www.googleapis.com/auth/spreadsheets",
          "https://www.googleapis.com/auth/drive.file",
        ],
        callbackURL: `${clientUrl}/dashboard/${workspaceId}/form/connection/${formId}?type=sheet`,
      });
    }

    if (provider === "Notion") {
      await authClient.linkSocial({
        provider: "notion",
        callbackURL: `${clientUrl}/dashboard/${workspaceId}/form/connection/${formId}?type=notion`,
      });
    }

    if (provider === "Slack") {
      await authClient.linkSocial({
        provider: "slack",
        scopes: ["channels:read", "chat:write"],
        callbackURL: `${clientUrl}/dashboard/${workspaceId}/form/connection/${formId}?type=webhook`,
      });
    }

    if (provider === "Gmail" || provider === "Gmail notification") {
      const callbackURL =
        provider === "Gmail"
          ? `${clientUrl}/dashboard/${workspaceId}/form/connection/${formId}?type=gmail`
          : `${clientUrl}/dashboard/${workspaceId}/form/connection/${formId}?type=gmail-notify`;

      await authClient.linkSocial({
        provider: "google",
        scopes: [
          "https://www.googleapis.com/auth/gmail.send",
          "https://www.googleapis.com/auth/gmail.labels",
        ],
        callbackURL,
      });
    }

    if (provider === "Webhook") {
      router.push(
        `${clientUrl}/dashboard/${workspaceId}/form/connection/${formId}?type=webhook`
      );
    }
  };

  return (
    <Card className="bg-muted/40 dark:bg-40 py-4 cursor-pointer border-none grid gap-6  w-full rounded-sm shadow-none h-full relative overflow-hidden">
      {isComingSoon && (
        <div className="w-full h-full absolute inset-x-0 bg-accent/65 grid place-content-center">
          Coming soon
        </div>
      )}
      <CardHeader className="gap-2 ">
        {icon && icon}
        <CardTitle className=" capitalize font-medium">{provider}</CardTitle>
        <CardDescription className="">{description}</CardDescription>
      </CardHeader>

      <CardFooter className=" ">
        <div className=" w-full flex  gap-2 ">
          <div className="">
            <Button
              className="w-full bg-transparent text-green-500 dark:text-green-400 hover:text-green-400 dark:hover:text-green-400  shadow-none"
              onClick={handleConnect}
              variant={"outline"}
            >
              Connect
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
