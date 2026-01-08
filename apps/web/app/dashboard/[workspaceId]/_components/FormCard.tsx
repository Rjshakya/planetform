"use client";
import { Button } from "@/components/ui/button";
import { CircleAlertIcon, Ellipsis, Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/axios";
import { mutate } from "swr";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toastPromiseOptions } from "@/lib/toast";

interface formProps {
  shortId: string;
  name: string;
}

export default function FormCard(props: formProps) {
  const router = useRouter();
  const { workspaceId: workspace } = useParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!props?.shortId || !workspace) return;

    setDeleting(true);
    try {
      await apiClient.delete(`/api/form/${props?.shortId}`);
    } catch (e) {
      console.log(e);
    }

    setDeleting(false);
    mutate(`/api/form/workspace/${workspace}`);
  };

  const handleDeleteWithToast = () =>
    toast.promise(handleDelete, toastPromiseOptions({}));

  const url = process.env.NEXT_PUBLIC_CLIENT_URL as string;

  return (
    <Item
      className=" py-2.5 px-2 cursor-pointer"
      variant={"default"}
      size={"default"}
      asChild
    >
      <Link href={`/dashboard/${workspace}/form/view/${props.shortId}`}>
        <ItemContent className=" px-0.5 ">
          <ItemTitle>
            <p className=" capitalize">{props?.name || "form"}</p>
          </ItemTitle>
        </ItemContent>
        <ItemActions onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="">
              <DropdownMenuItem
                // onClick={() => router.push(`${url}/${props.shortId}`)}
                className="w-full flex items-center gap-2"
              >
                <Link
                  className="w-full flex items-center gap-2"
                  target="_blank"
                  href={`${url}/${props.shortId}`}
                >
                  <span className=" ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className=" size-5 fill-foreground"
                      viewBox="0 0 24 24"
                      fill="#fff"
                    >
                      <path
                        opacity="0.4"
                        d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                      <path
                        d="M16.748 7H11.918C11.508 7 11.168 7.34 11.168 7.75C11.168 8.16 11.508 8.5 11.918 8.5H14.938L7.21805 16.22C6.92805 16.51 6.92805 16.99 7.21805 17.28C7.36805 17.43 7.55805 17.5 7.74805 17.5C7.93805 17.5 8.12805 17.43 8.27805 17.28L15.998 9.56V12.58C15.998 12.99 16.338 13.33 16.748 13.33C17.158 13.33 17.498 12.99 17.498 12.58V7.75C17.498 7.34 17.158 7 16.748 7Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                    </svg>
                  </span>
                  <span>Go to</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/dashboard/${workspace}/form/view/${props.shortId}`
                  )
                }
                className="w-full flex items-center gap-2"
              >
                <span className=" ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className=" size-5 fill-foreground"
                    viewBox="0 0 24 24"
                    fill="#fff"
                  >
                    <g clipPath="url(#clip0_4418_5191)">
                      <path
                        opacity="0.4"
                        d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                      <path
                        d="M16.8299 9.41047C16.7599 9.24047 16.6199 9.10047 16.4499 9.03047C16.3699 9.00047 16.2799 8.98047 16.1899 8.98047H14.3299C13.9399 8.98047 13.6299 9.29047 13.6299 9.68047C13.6299 10.0705 13.9399 10.3805 14.3299 10.3805H14.5099L12.3999 12.4905L11.3799 10.9705C11.2599 10.8005 11.0799 10.6805 10.8699 10.6605C10.6499 10.6405 10.4599 10.7105 10.3099 10.8605L7.32994 13.8405C7.05994 14.1105 7.05994 14.5505 7.32994 14.8305C7.46994 14.9705 7.63994 15.0305 7.81994 15.0305C7.99994 15.0305 8.17994 14.9605 8.30994 14.8305L10.6899 12.4505L11.7099 13.9705C11.8299 14.1405 12.0099 14.2605 12.2199 14.2805C12.4399 14.3005 12.6299 14.2305 12.7799 14.0805L15.4999 11.3605V11.5405C15.4999 11.9305 15.8099 12.2405 16.1999 12.2405C16.5899 12.2405 16.8999 11.9305 16.8999 11.5405V9.67047C16.8799 9.58047 16.8699 9.49047 16.8299 9.41047Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4418_5191">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>

                <span>Responses</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/dashboard/${workspace}/form/edit/${props.shortId}?name=${props.name}`
                  )
                }
                className="w-full flex items-center gap-2"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className=" size-5 fill-foreground"
                    viewBox="0 0 24 24"
                    fill="#fff"
                  >
                    <g clipPath="url(#clip0_4418_4832)">
                      <path
                        opacity="0.4"
                        d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52V16.47C2 19.94 4.07 22 7.52 22H15.47C18.93 22 20.99 19.94 20.99 16.48V8.52C21 5.06 18.93 3 15.48 3Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                      <path
                        d="M21.02 2.98028C19.23 1.18028 17.48 1.14028 15.64 2.98028L14.51 4.10028C14.41 4.20028 14.38 4.34028 14.42 4.47028C15.12 6.92028 17.08 8.88028 19.53 9.58028C19.56 9.59028 19.61 9.59028 19.64 9.59028C19.74 9.59028 19.84 9.55028 19.91 9.48028L21.02 8.36028C21.93 7.45028 22.38 6.58028 22.38 5.69028C22.38 4.79028 21.93 3.90028 21.02 2.98028Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                      <path
                        d="M17.8601 10.4198C17.5901 10.2898 17.3301 10.1598 17.0901 10.0098C16.8901 9.88984 16.6901 9.75984 16.5001 9.61984C16.3401 9.51984 16.1601 9.36984 15.9801 9.21984C15.9601 9.20984 15.9001 9.15984 15.8201 9.07984C15.5101 8.82984 15.1801 8.48984 14.8701 8.11984C14.8501 8.09984 14.7901 8.03984 14.7401 7.94984C14.6401 7.83984 14.4901 7.64984 14.3601 7.43984C14.2501 7.29984 14.1201 7.09984 14.0001 6.88984C13.8501 6.63984 13.7201 6.38984 13.6001 6.12984C13.4701 5.84984 13.3701 5.58984 13.2801 5.33984L7.9001 10.7198C7.5501 11.0698 7.2101 11.7298 7.1401 12.2198L6.7101 15.1998C6.6201 15.8298 6.7901 16.4198 7.1801 16.8098C7.5101 17.1398 7.9601 17.3098 8.4601 17.3098C8.5701 17.3098 8.6801 17.2998 8.7901 17.2898L11.7601 16.8698C12.2501 16.7998 12.9101 16.4698 13.2601 16.1098L18.6401 10.7298C18.3901 10.6498 18.1401 10.5398 17.8601 10.4198Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4418_4832">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span>Edit</span>
              </DropdownMenuItem>

              <AlertDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
              >
                <AlertDialogTrigger className="hover:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative cursor-default rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full flex items-center gap-2">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className=" size-5 fill-destructive"
                      viewBox="0 0 24 24"
                      fill="#fff"
                    >
                      <g clipPath="url(#clip0_4418_4925)">
                        <path
                          d="M21.0702 5.23C19.4602 5.07 17.8502 4.95 16.2302 4.86V4.85L16.0102 3.55C15.8602 2.63 15.6402 1.25 13.3002 1.25H10.6802C8.35016 1.25 8.13016 2.57 7.97016 3.54L7.76016 4.82C6.83016 4.88 5.90016 4.94 4.97016 5.03L2.93016 5.23C2.51016 5.27 2.21016 5.64 2.25016 6.05C2.29016 6.46 2.65016 6.76 3.07016 6.72L5.11016 6.52C10.3502 6 15.6302 6.2 20.9302 6.73C20.9602 6.73 20.9802 6.73 21.0102 6.73C21.3902 6.73 21.7202 6.44 21.7602 6.05C21.7902 5.64 21.4902 5.27 21.0702 5.23Z"
                          fill="white"
                          style={{ fill: "var(--fillg)" }}
                        />
                        <path
                          opacity="0.3991"
                          d="M19.2302 8.14C18.9902 7.89 18.6602 7.75 18.3202 7.75H5.68024C5.34024 7.75 5.00024 7.89 4.77024 8.14C4.54024 8.39 4.41024 8.73 4.43024 9.08L5.05024 19.34C5.16024 20.86 5.30024 22.76 8.79024 22.76H15.2102C18.7002 22.76 18.8402 20.87 18.9502 19.34L19.5702 9.09C19.5902 8.73 19.4602 8.39 19.2302 8.14Z"
                          fill="white"
                          style={{ fill: "var(--fillg)" }}
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.58008 17C9.58008 16.5858 9.91586 16.25 10.3301 16.25H13.6601C14.0743 16.25 14.4101 16.5858 14.4101 17C14.4101 17.4142 14.0743 17.75 13.6601 17.75H10.3301C9.91586 17.75 9.58008 17.4142 9.58008 17Z"
                          fill="white"
                          style={{ fill: "var(--fillg)" }}
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.75 13C8.75 12.5858 9.08579 12.25 9.5 12.25H14.5C14.9142 12.25 15.25 12.5858 15.25 13C15.25 13.4142 14.9142 13.75 14.5 13.75H9.5C9.08579 13.75 8.75 13.4142 8.75 13Z"
                          fill="white"
                          style={{ fill: "var(--fillg)" }}
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4418_4925">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <p>Delete</p>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                      aria-hidden="true"
                    >
                      <CircleAlertIcon />
                    </div>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete form
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteWithToast}>
                      {deleting && <Loader className=" animate-spin" />}
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Link>
    </Item>
  );
}
