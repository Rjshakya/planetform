"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
} from "@/components/ui/shadcn-io/tabs";
import { Submissions } from "./_components/Submissions";
import { apiClient } from "@/lib/axios";
import useSWR from "swr";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Integrations } from "./_components/Integrations";
import { Analytics } from "./_components/Analytics";
import { authClient, signOut } from "@/lib/auth-client";
import { useUser } from "@/hooks/use-User";
import { Settings } from "./_components/Settings";
import { JSX, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const fetcher = (url: string) => apiClient.get(url);
export default function Page() {
  const { formId } = useParams();
  const [value, setValue] = useState("Submission");

  const { data, error, isLoading } = useSWR(
    `/api/form/${formId}/meta_data`,
    fetcher
  );
  useUser();

  return (
    <main className=" w-full pb-12 relative overflow-hidden">
      <div className="grid gap-12 max-w-4xl  mx-auto">
        <div className=" px-2">
          <p className=" text-muted-foreground text-2xl font-semibold">
            {data?.data?.form?.name || "form"}
          </p>
        </div>
        <Tabs
          className="grid "
          value={value}
          onValueChange={(v) => {
            setValue(v);
          }}
        >
          <TabsList
            // activeClassName="bg-transparent border-b-2 border-ring shadow-none rounded-none  "
            className=" rounded-sm  gap-4 w-full sm:w-fit overflow-auto flex  items-center justify-between "
            // className="gap-2"
          >
            <TabsTrigger
              className="border-0 text-left text-sm py-4 px-2 gap-2"
              value="Submission"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=" size-5 fill-green-500"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <g clipPath="url(#clip0_4418_4830)">
                    <path
                      opacity="0.4"
                      d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M15.8002 2.21048C15.3902 1.80048 14.6802 2.08048 14.6802 2.65048V6.14048C14.6802 7.60048 15.9202 8.81048 17.4302 8.81048C18.3802 8.82048 19.7002 8.82048 20.8302 8.82048C21.4002 8.82048 21.7002 8.15048 21.3002 7.75048C19.8602 6.30048 17.2802 3.69048 15.8002 2.21048Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M12.2799 14.72C11.9899 14.43 11.5099 14.43 11.2199 14.72L10.4999 15.44V11.25C10.4999 10.84 10.1599 10.5 9.74994 10.5C9.33994 10.5 8.99994 10.84 8.99994 11.25V15.44L8.27994 14.72C7.98994 14.43 7.50994 14.43 7.21994 14.72C6.92994 15.01 6.92994 15.49 7.21994 15.78L9.21994 17.78C9.22994 17.79 9.23994 17.79 9.23994 17.8C9.29994 17.86 9.37994 17.91 9.45994 17.95C9.55994 17.98 9.64994 18 9.74994 18C9.84994 18 9.93994 17.98 10.0299 17.94C10.1199 17.9 10.1999 17.85 10.2799 17.78L12.2799 15.78C12.5699 15.49 12.5699 15.01 12.2799 14.72Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_4830">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              Submission
            </TabsTrigger>
            <TabsTrigger
              className=" border-0 text-left text-sm py-4  px-2 gap-2"
              value="Analytics"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=" size-5 fill-purple-500"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <g clipPath="url(#clip0_4418_5182)">
                    <path
                      opacity="0.4"
                      d="M22 7.81V15.16C21.71 15.02 21.39 14.92 21.03 14.86L20.72 14.81L20.46 14.27C19.91 13.15 19.01 12.5 18 12.5C16.99 12.5 16.09 13.15 15.54 14.27L15.27 14.81L14.97 14.86C13.78 15.06 12.92 15.72 12.61 16.66C12.31 17.61 12.62 18.65 13.47 19.51L13.78 19.82L13.75 19.94C13.55 20.83 13.63 21.51 13.82 22H7.81C4.17 22 2 19.83 2 16.19V7.81C2 4.17 4.17 2 7.81 2H16.19C19.83 2 22 4.17 22 7.81Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M19.1199 14.9395L19.4399 15.5895C19.5999 15.9095 20.0099 16.2095 20.3499 16.2695L20.7799 16.3395C22.0899 16.5595 22.3899 17.5195 21.4599 18.4595L21.0599 18.8595C20.7899 19.1295 20.6499 19.6495 20.7299 20.0295L20.7799 20.2695C21.1399 21.8495 20.2999 22.4595 18.9299 21.6295L18.6399 21.4495C18.2899 21.2395 17.7099 21.2395 17.3599 21.4495L17.0699 21.6295C15.6899 22.4595 14.8599 21.8495 15.2199 20.2695L15.2699 20.0295C15.3499 19.6595 15.2099 19.1295 14.9399 18.8595L14.5399 18.4595C13.6099 17.5095 13.9099 16.5595 15.2199 16.3395L15.6499 16.2695C15.9999 16.2095 16.3999 15.9095 16.5599 15.5895L16.8799 14.9395C17.4999 13.6895 18.4999 13.6895 19.1199 14.9395Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.1296 7.91704C16.457 8.17081 16.5167 8.64192 16.2629 8.9693L13.9485 11.955C13.3536 12.7073 12.2567 12.8445 11.4916 12.2533L11.4863 12.2492L9.65976 10.8119C9.54691 10.7262 9.38952 10.7475 9.30382 10.8581C9.30374 10.8582 9.3039 10.858 9.30382 10.8581L6.9243 13.9475C6.67154 14.2756 6.20062 14.3367 5.87246 14.084C5.5443 13.8312 5.48318 13.3603 5.73593 13.0321L8.11666 9.94122C8.71057 9.17263 9.81178 9.03371 10.5787 9.62634L10.5839 9.63038L12.4105 11.0677C12.5245 11.1543 12.6852 11.132 12.7703 11.0265L15.0774 8.05031C15.3312 7.72293 15.8023 7.66327 16.1296 7.91704Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_5182">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              Analytics
            </TabsTrigger>
            <TabsTrigger
              className=" border-0 text-left text-sm py-4  px-2 gap-2"
              value="Integrations"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 fill-red-500"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <g clipPath="url(#clip0_4418_4611)">
                    <path
                      opacity="0.4"
                      d="M15.0002 22.75C14.7302 22.75 14.4802 22.6 14.3502 22.37C14.2202 22.14 14.2202 21.85 14.3602 21.62L15.4102 19.87C15.6202 19.51 16.0802 19.4 16.4402 19.61C16.8002 19.82 16.9102 20.28 16.7002 20.64L16.4302 21.09C19.1902 20.44 21.2602 17.96 21.2602 15C21.2602 14.59 21.6002 14.25 22.0102 14.25C22.4202 14.25 22.7602 14.59 22.7602 15C22.7502 19.27 19.2702 22.75 15.0002 22.75Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      opacity="0.4"
                      d="M2 9.75C1.59 9.75 1.25 9.41 1.25 9C1.25 4.73 4.73 1.25 9 1.25C9.27 1.25 9.51999 1.4 9.64999 1.63C9.77999 1.86 9.78 2.15 9.64 2.38L8.59 4.13C8.38 4.49001 7.92 4.60001 7.56 4.39001C7.2 4.18001 7.09 3.71999 7.3 3.35999L7.57001 2.90997C4.81001 3.55997 2.74001 6.04 2.74001 9C2.75001 9.41 2.41 9.75 2 9.75Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M10.6704 13.8504L7.53044 12.1604C7.20044 11.9804 6.80044 11.9804 6.47044 12.1604L3.33044 13.8504C3.10044 13.9704 2.96045 14.2204 2.96045 14.4904C2.96045 14.7604 3.10044 15.0104 3.33044 15.1304L6.47044 16.8204C6.64044 16.9104 6.82044 16.9504 7.00044 16.9504C7.18044 16.9504 7.36044 16.9104 7.53044 16.8204L10.6704 15.1304C10.9004 15.0104 11.0404 14.7604 11.0404 14.4904C11.0404 14.2204 10.8904 13.9804 10.6704 13.8504Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M5.95023 17.4106L3.03023 15.9506C2.81023 15.8406 2.55023 15.8506 2.33023 15.9806C2.12023 16.1106 1.99023 16.3407 1.99023 16.5907V19.3506C1.99023 19.8306 2.25022 20.2606 2.68022 20.4706L5.60023 21.9306C5.70023 21.9806 5.81023 22.0106 5.92023 22.0106C6.05023 22.0106 6.18023 21.9707 6.30023 21.9007C6.51023 21.7707 6.64023 21.5406 6.64023 21.2906V18.5307C6.65023 18.0507 6.38023 17.6206 5.95023 17.4106Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M11.6601 15.9806C11.4501 15.8506 11.1901 15.8406 10.9601 15.9506L8.04008 17.4106C7.61008 17.6206 7.3501 18.0507 7.3501 18.5307V21.2906C7.3501 21.5406 7.48009 21.7707 7.69009 21.9007C7.81009 21.9707 7.9401 22.0106 8.0701 22.0106C8.1801 22.0106 8.29009 21.9806 8.39009 21.9306L11.3101 20.4706C11.7401 20.2606 12.0001 19.8306 12.0001 19.3506V16.5907C12.0001 16.3407 11.8701 16.1106 11.6601 15.9806Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M20.6704 3.83086L17.5304 2.14086C17.2004 1.96086 16.8004 1.96086 16.4704 2.14086L13.3304 3.83086C13.1004 3.95086 12.9604 4.20082 12.9604 4.47082C12.9604 4.74082 13.1004 4.99083 13.3304 5.11083L16.4704 6.80083C16.6404 6.89083 16.8204 6.93084 17.0004 6.93084C17.1804 6.93084 17.3604 6.89083 17.5304 6.80083L20.6704 5.11083C20.9004 4.99083 21.0404 4.74082 21.0404 4.47082C21.0404 4.19082 20.8904 3.95086 20.6704 3.83086Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M15.9502 7.38134L13.0302 5.92132C12.8102 5.81132 12.5502 5.82134 12.3302 5.95134C12.1202 6.08134 11.9902 6.31133 11.9902 6.56133V9.32134C11.9902 9.80134 12.2502 10.2313 12.6802 10.4413L15.6002 11.9014C15.7002 11.9514 15.8102 11.9813 15.9202 11.9813C16.0502 11.9813 16.1802 11.9413 16.3002 11.8713C16.5102 11.7413 16.6402 11.5113 16.6402 11.2613V8.50133C16.6502 8.02133 16.3802 7.59134 15.9502 7.38134Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M21.6601 5.95134C21.4501 5.82134 21.1901 5.81132 20.9601 5.92132L18.0401 7.38134C17.6101 7.59134 17.3501 8.02133 17.3501 8.50133V11.2613C17.3501 11.5113 17.4801 11.7413 17.6901 11.8713C17.8101 11.9413 17.9401 11.9813 18.0701 11.9813C18.1801 11.9813 18.2901 11.9514 18.3901 11.9014L21.3101 10.4413C21.7401 10.2313 22.0001 9.80134 22.0001 9.32134V6.56133C22.0001 6.31133 21.8701 6.08134 21.6601 5.95134Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_4611">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              Integrations
            </TabsTrigger>
            <TabsTrigger
              className=" border-0 text-left text-sm py-4  px-2 gap-2"
              value="Settings"
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
          <TabsContents className=" ">
            <TabsContent className="px-1  grid gap-2 mt-4  " value="Submission">
              <Submissions />
            </TabsContent>
            <TabsContent className="px-1 mt-4" value="Analytics">
              <Analytics />
            </TabsContent>
            <TabsContent className="px-1 mt-4" value="Integrations">
              <Integrations
                data={data?.data?.form?.integrations}
                error={error}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent className=" mt-4" value="Settings">
              <Settings />
            </TabsContent>
          </TabsContents>
        </Tabs>
      </div>
    </main>
  );
}
