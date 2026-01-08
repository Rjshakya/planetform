"use client";
import { Button } from "@/components/ui/button";

import { Loader, TriangleAlert } from "lucide-react";
import { WorkspaceCard } from "./WorkspaceCard";

import { apiClient } from "@/lib/axios";
import { createWorkspaceParams } from "@/lib/types";
import { toast } from "sonner";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/hooks/use-workspace";
import { useRouter } from "next/navigation";

export default function Workspace() {
  const [creating, setCreating] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const { workspace, error, isLoading, mutate, userId, customerId } =
    useWorkspace();
  const [open, setOpen] = useState(false);

  const handleCreateWorkspace = async (params: createWorkspaceParams) => {
    if (!params.owner || !params.name) {
      return;
    }
    setCreating(true);
    try {
      const res = await apiClient.post("/api/workspace", params);
      if (res.data) {
        mutate();
        toast(params.name + " workspace created");
      }
    } catch (e) {
      toast("failed to create workspace");
    }

    setCreating(false);
    toast(`${params.name} created`);
    setOpen(false);
    setWorkspaceName("");
  };

  if (error) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center gap-4">
        <span>
          <TriangleAlert className=" text-destructive" />
        </span>
        <p>failed to get your workspaces</p>
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
    <div className="grid gap-6   w-full ">
      <div className=" header w-full">
        <div className=" w-full flex items-center justify-between p-2">
          <div className=" w-full">
            <h3 className=" font-medium text-muted-foreground">
              Your workspaces
            </h3>
          </div>
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant={"secondary"}>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 fill-foreground "
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_4418_9825)">
                        <path
                          className="stroke-foreground"
                          d="M6 12H18"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          className="stroke-foreground"
                          d="M12 18V6"
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
                  <span onClick={() => setOpen(true)}>Workspace</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="gap-4 px-5 font-sans tracking-tighter p-8">
                <DialogHeader>
                  <DialogTitle className="text-base font-medium">
                    Create new workspace
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label className="text-lg">Name</Label>
                  <Input
                    placeholder="my-workspace-1"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e?.currentTarget?.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        await handleCreateWorkspace({
                          name: workspaceName,
                          owner: userId || "",
                          customerId: customerId || "",
                        });
                      }
                    }}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={async () =>
                      handleCreateWorkspace({
                        name: workspaceName,
                        owner: userId || "",
                        customerId: customerId || "",
                      })
                    }
                  >
                    {creating && <Loader className={`animate-spin`} />}
                    <span>Submitt</span>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className=" w-full flex-col gap-4">
        {workspace && workspace?.length > 0 ? (
          workspace?.map((w: { id: string; name: string }) => (
            <WorkspaceCard id={w?.id} name={w?.name} key={w?.id} />
          ))
        ) : (
          <EmptyWorkspace setOpen={setOpen} />
        )}
      </div>
    </div>
  );
}

export const EmptyWorkspace = ({
  setOpen,
}: {
  setOpen: (val: boolean) => void;
}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <div>
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
        </EmptyMedia>
        <EmptyTitle>No Workspace Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any workspace yet. Get started by creating
          your first workspace.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button variant={"ghost"} onClick={() => setOpen(true)}>
            Create workspace
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};
