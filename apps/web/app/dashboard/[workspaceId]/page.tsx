"use client";

import { Button } from "@/components/ui/button";
import { Loader, PlusIcon, TriangleAlert } from "lucide-react";
import { apiClient } from "@/lib/axios";

import useSWR from "swr";
import FormCard from "./_components/FormCard";
import { useParams, useRouter } from "next/navigation";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
} from "@/components/ui/shadcn-io/tabs";
import { FormsTab } from "./_components/FormsTab";
import { useUser } from "@/hooks/use-User";
import Link from "next/link";
import { WorkspaceSettings } from "./_components/WorkspaceSettings";

const fetcher = (url: string) => apiClient.get(url).then((r) => r?.data);

export default function Page() {
  const { workspaceId } = useParams();
  const { data, error, isLoading } = useSWR(
    `/api/form/workspace/${workspaceId}`,
    fetcher
  );
  useUser();

  if (error) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center gap-4">
        <span>
          <TriangleAlert className=" text-destructive" />
        </span>
        <p>failed to get your forms</p>
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
    <div className="grid gap-12 max-w-4xl w-full mx-auto">
      <div className="flex justify-between items-center gap-2">
        <div className=" text-muted-foreground text-2xl font-semibold">
          {data?.workspace?.name || "Your workspace"}
        </div>

        <div className="">
          <Link href={`/dashboard/${workspaceId}/form/create`}>
            <Button>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
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
              <p>Form</p>
            </Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="forms" className="w-full">
        <TabsList
          // activeClassName="bg-transparent border-b-2 border-ring shadow-none rounded-none  "
          className=" "
        >
          <TabsTrigger
            data-id={"forms"}
            className="border-0 text-left text-sm w-full h-full py-4  px-4 gap-2"
            value="forms"
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-5 ${
                  data?.workspace?.forms?.length
                    ? "fill-green-500"
                    : "fill-red-500"
                }`}
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
            Forms
          </TabsTrigger>
          <TabsTrigger
            data-id={"settings"}
            className="border-0 text-left text-sm w-full h-full py-4  px-4 gap-2"
            value="settings"
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=" size-5 fill-foreground"
                viewBox="0 0 24 24"
                fill="#fff"
              >
                <g clipPath="url(#clip0_4418_8720)">
                  <path
                    d="M20.1 9.21945C18.29 9.21945 17.55 7.93945 18.45 6.36945C18.97 5.45945 18.66 4.29945 17.75 3.77945L16.02 2.78945C15.23 2.31945 14.21 2.59945 13.74 3.38945L13.63 3.57945C12.73 5.14945 11.25 5.14945 10.34 3.57945L10.23 3.38945C9.78 2.59945 8.76 2.31945 7.97 2.78945L6.24 3.77945C5.33 4.29945 5.02 5.46945 5.54 6.37945C6.45 7.93945 5.71 9.21945 3.9 9.21945C2.86 9.21945 2 10.0694 2 11.1194V12.8794C2 13.9194 2.85 14.7794 3.9 14.7794C5.71 14.7794 6.45 16.0594 5.54 17.6294C5.02 18.5394 5.33 19.6994 6.24 20.2194L7.97 21.2094C8.76 21.6794 9.78 21.3995 10.25 20.6094L10.36 20.4194C11.26 18.8494 12.74 18.8494 13.65 20.4194L13.76 20.6094C14.23 21.3995 15.25 21.6794 16.04 21.2094L17.77 20.2194C18.68 19.6994 18.99 18.5294 18.47 17.6294C17.56 16.0594 18.3 14.7794 20.11 14.7794C21.15 14.7794 22.01 13.9294 22.01 12.8794V11.1194C22 10.0794 21.15 9.21945 20.1 9.21945ZM12 15.2494C10.21 15.2494 8.75 13.7894 8.75 11.9994C8.75 10.2094 10.21 8.74945 12 8.74945C13.79 8.74945 15.25 10.2094 15.25 11.9994C15.25 13.7894 13.79 15.2494 12 15.2494Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4418_8720">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContents className="mt-4">
          <TabsContent className="  grid gap-2 " value="forms">
            <FormsTab forms={data?.workspace?.forms || []} />
          </TabsContent>
          <TabsContent className="" value="settings">
            <WorkspaceSettings workspaceName={data?.workspace?.name} />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
}
