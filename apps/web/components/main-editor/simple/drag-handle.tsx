import { Editor } from "@tiptap/core";
import DragHandle from "@tiptap/extension-drag-handle-react";
import React, { memo, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Node } from "@tiptap/pm/model";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";

export const EditorDragHandle = memo(function Dragcomp({
  editor,
}: {
  editor: Editor | null;
}) {
  const [isInputNode, setIsInputNode] = React.useState(false);
  const [nodePosition, setNodePosition] = React.useState<number | null>(null);
  const [currentNode, setCurrentNode] = React?.useState<Node | null>(null);
  const [openPopover, setOpenPopover] = React.useState(false);

  const handleDeleteNode = async (currentNode: Node | null) => {
    if (!editor || !currentNode) return;

    try {
      if (currentNode.type.name === "uploadImage" && currentNode?.attrs?.src) {
        const src = currentNode?.attrs?.src as string;
        const key = src.split("xyz/")[1];
        await apiClient.put(`/api/file/delete`, { key });
      }
      editor
        ?.chain()
        ?.focus()
        ?.setNodeSelection(nodePosition!)
        ?.deleteSelection()
        ?.run();
    } catch (e) {
      toast.error("failed to delete node");
    }
  };

  return (
    <DragHandle
      computePositionConfig={{ strategy: "fixed" }}
      onNodeChange={({ node, pos, editor }) => {
        setCurrentNode(node);
        setNodePosition(pos);

        if (node?.type?.name?.includes("Input")) {
          setIsInputNode(true);
        } else {
          setIsInputNode(false);
        }
      }}
      editor={editor!}
      className={cn(``)}
    >
      <div className="pt-1  pl-5 md:px-2">
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          {currentNode && (
            <PopoverTrigger asChild className=" cursor-pointer">
              <div className="flex items-center gap-2">
                <GripVertical size={16} />
              </div>
            </PopoverTrigger>
          )}

          {currentNode && (
            <PopoverContent
              side="left"
              sticky="always"
              className=" w-56 rounded-sm  shadow-xl py-4 px-2 grid gap-4 text-sm mx-4"
            >
              {isInputNode &&
                currentNode &&
                Object?.entries?.(currentNode.attrs)?.map?.((o, i) => {
                  if (o[0] === "placeholder") {
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-between gap-3 w-full px-1"
                      >
                        <Label className="w-full flex-1 ">
                          {"Placeholder"}
                        </Label>
                        <Input
                          className={cn(
                            "h-8 text-xs md:text-xs rounded-sm",
                            "focus-visible:outline-none focus-visible:ring-0"
                          )}
                          placeholder={o[1]}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();

                              setOpenPopover(false);
                            }
                          }}
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            editor
                              ?.chain()
                              .setNodeSelection(nodePosition!)
                              .updateAttributes(currentNode?.type?.name, {
                                [o[0]]: value,
                              })
                              .run();
                          }}
                        />
                        <Separator
                          orientation="horizontal"
                          className=" dark:bg-accent "
                        />
                      </div>
                    );
                  }
                  if (o?.[0] === "isRequired") {
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 w-full px-1.5"
                      >
                        <Label htmlFor="requiredCheck" className=" ">
                          {"Required"}
                        </Label>
                        <div className="">
                          <Switch
                            id="requiredCheck"
                            className=""
                            defaultChecked={o[1]}
                            onCheckedChange={(e) => {
                              const checked = e;
                              editor
                                ?.chain()
                                ?.setNodeSelection(nodePosition!)
                                ?.updateAttributes(currentNode?.type?.name, {
                                  [o[0]]: checked,
                                })
                                .run();
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                  if (o?.[0] === "isDropdown") {
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 w-full px-1.5"
                      >
                        <Label htmlFor="requiredCheck" className=" ">
                          {"Dropdown"}
                        </Label>
                        <div className="">
                          <Switch
                            id="requiredCheck"
                            className=""
                            defaultChecked={o[1]}
                            onCheckedChange={(e) => {
                              const checked = e;
                              editor
                                ?.chain()
                                ?.setNodeSelection(nodePosition!)
                                ?.updateAttributes(currentNode?.type?.name, {
                                  [o[0]]: checked,
                                })
                                .run();
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                })}

              {currentNode && (
                <div className="flex items-center justify-between gap-2 w-full px-1.5">
                  <Label htmlFor="requiredCheck" className=" ">
                    Delete
                  </Label>
                  <div className="">
                    <Button
                      className="size-6"
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => handleDeleteNode(currentNode)}
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className=" size-4 fill-foreground"
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
                    </Button>
                  </div>
                </div>
              )}
            </PopoverContent>
          )}
        </Popover>
      </div>
    </DragHandle>
  );
});
