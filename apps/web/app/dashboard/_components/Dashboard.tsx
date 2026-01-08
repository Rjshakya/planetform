"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { File, Folder, Loader, TriangleAlert, Users } from "lucide-react";
import Workspace from "./Workspace";
import { apiClient } from "@/lib/axios";
import useSWR from "swr";
import { useUser } from "@/hooks/use-User";
import { useWorkspace } from "@/hooks/use-workspace";
import { createWorkspaceParams } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const DashboardComp = () => {
  const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);
  const { user } = useUser();
  const { data, error, isLoading } = useSWR(
    () => `/api/analytics/dashboard/` + user?.dodoCustomerId,
    fetcher
  );
  const router = useRouter();
  const { workspace, userId, customerId } = useWorkspace();

  const handleCreateForm = async () => {
    if (!userId) return;

    try {
      if (workspace && workspace?.length === 0) {
        const workspaceBody = {
          name: "my-wrkspace",
          owner: userId,
          customerId: customerId,
        } as createWorkspaceParams;
        const { data, status } = await apiClient.post(
          "/api/workspace",
          workspaceBody
        );

        if (status === 200) {
          const { id } = data?.workspace;
          router.push(`/dashboard/${id}/form/create`);
        }
      }

      if (workspace && workspace?.length > 0) {
        router.push(`/dashboard/${workspace[0]?.id}/form/create`);
      }
    } catch (e) {
      toast.error("failed to create form");
    }
  };

  if (error) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center gap-4">
        <span>
          <TriangleAlert className=" text-destructive" />
        </span>
        <p>failed to get your dashboard</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto grid gap-6 pb-12">
      <div className="flex items-center justify-between gap-1">
        <h1 className=" text-2xl font-semibold">Dashboard</h1>
        <Button size={"default"} onClick={handleCreateForm}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clipPath="url(#clip0_4418_9825)">
                <path
                  d="M6 12H18"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18V6"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_4418_9825">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          Form
        </Button>
      </div>
      <div className=" grid md:grid-cols-2 grid-cols-1 gap-2">
        <Card className=" shadow-none border-none bg-muted/40 dark:bg-card">
          <CardHeader className="px-7">
            <Button size={"icon"} variant={"secondary"}>
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=" size-5 fill-purple-500"
                  viewBox="0 0 24 24"
                  fill="#fffcfc"
                >
                  <g clipPath="url(#clip0_4418_4295)">
                    <path
                      d="M22 11.0704V16.6504C22 19.6004 19.6 22.0004 16.65 22.0004H7.35C4.4 22.0004 2 19.6004 2 16.6504V9.44043H21.74C21.89 9.89043 21.97 10.3504 21.99 10.8404C22 10.9104 22 11.0004 22 11.0704Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      opacity="0.4"
                      d="M21.74 9.44H2V6.42C2 3.98 3.98 2 6.42 2H8.75C10.38 2 10.89 2.53 11.54 3.4L12.94 5.26C13.25 5.67 13.29 5.73 13.87 5.73H16.66C19.03 5.72 21.05 7.28 21.74 9.44Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_4295">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </Button>
          </CardHeader>
          <CardContent className=" px-8 flex flex-col gap-2">
            <p className="font-semibold text-2xl">
              {data?.TotalWorkspaces || 0}
            </p>
            <p>Workspace</p>
          </CardContent>
        </Card>
        <Card className=" shadow-none border-none bg-muted/40 dark:bg-card ">
          <CardHeader className="px-7">
            <Button size={"icon"} variant={"secondary"}>
              {" "}
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`size-5 ${data?.TotalForms ? "fill-green-500" : "fill-red-500"}`}
                  viewBox="0 0 24 24"
                  fill="#fffcfc"
                >
                  <g clipPath="url(#clip0_4418_4828)">
                    <path
                      opacity="0.4"
                      d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"
                      fill="white"
                      style={{ fill: "var(--fillg" }}
                    />
                    <path
                      d="M18.5 9.25H16.5C14.98 9.25 13.75 8.02 13.75 6.5V4.5C13.75 4.09 14.09 3.75 14.5 3.75C14.91 3.75 15.25 4.09 15.25 4.5V6.5C15.25 7.19 15.81 7.75 16.5 7.75H18.5C18.91 7.75 19.25 8.09 19.25 8.5C19.25 8.91 18.91 9.25 18.5 9.25Z"
                      fill="white"
                      style={{ fill: "var(--fillg" }}
                    />
                    <path
                      d="M12 13.75H8C7.59 13.75 7.25 13.41 7.25 13C7.25 12.59 7.59 12.25 8 12.25H12C12.41 12.25 12.75 12.59 12.75 13C12.75 13.41 12.41 13.75 12 13.75Z"
                      fill="white"
                      style={{ fill: "var(--fillg" }}
                    />
                    <path
                      d="M16 17.75H8C7.59 17.75 7.25 17.41 7.25 17C7.25 16.59 7.59 16.25 8 16.25H16C16.41 16.25 16.75 16.59 16.75 17C16.75 17.41 16.41 17.75 16 17.75Z"
                      fill="white"
                      style={{ fill: "var(--fillg" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_4828">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </Button>
          </CardHeader>
          <CardContent className=" px-8 flex flex-col gap-2">
            <p className="font-semibold text-2xl">{data?.TotalForms || 0}</p>
            <p>Forms</p>
          </CardContent>
        </Card>
      </div>
      <Workspace />
    </div>
  );
};
