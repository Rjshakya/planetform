"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useRef, useState } from "react";
import { InsertMultipleChoiceParams, Ioptions } from "./node";

import { useFormStore } from "@/stores/useformStore";
import { NodeViewContent } from "@tiptap/react";

import { AnimatePresence, motion } from "motion/react";
import { validationFn } from "../FormFieldValidations";

import { useOutsideClick } from "@/hooks/use-outside-click";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useConditionalVisibility } from "@/hooks/use-conditional-visibility";

export const MultipleChoiceView = (props: NodeViewProps) => {
  const { id, label, isDropdown, type, isRequired } = props?.node
    ?.attrs as InsertMultipleChoiceParams;
  const form = useFormStore.getState().getHookForm();
  const isVisible = useConditionalVisibility(id);
  if (!isVisible && !props?.editor?.isEditable) {
    return null;
  }

  return (
    <>
      <NodeViewWrapper as={"div"} className={"w-full relative "}>
        <FormField
          control={form?.control}
          name={id}
          rules={{
            validate: validationFn({ isRequired, type: "multipleChoiceInput" }),
          }}
          render={({ field }) => (
            <FormItem className="mt-4 field mb-3 gap-3 ">
              <FormLabel
                htmlFor={label}
                aria-label={label}
                className="text-md grid gap-2"
                id={id}
              >
                <div className="flex items-center gap-1 ">
                  {props?.editor?.isEditable ? (
                    <input
                      className="flex-1 appearance-none  bg-background focus-visible:ring-0 focus:outline-none"
                      value={label}
                      onChange={(e) => {
                        props.updateAttributes({
                          label: e.currentTarget.value,
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          return e.preventDefault();
                        }
                        if (label === "" && e.key === "Backspace") {
                          props.deleteNode();
                        }
                      }}
                    />
                  ) : (
                    <p className="flex-1">{label}</p>
                  )}
                </div>

                {props.editor.isEditable && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      filter: "blur(2px)",
                    }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      filter: "blur(0px)",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <NodeViewContent
                      className={`content px-2 overflow-y-auto`}
                    />
                  </motion.div>
                )}

                {props.editor.isEditable === false && isDropdown ? (
                  <DropDownNode
                    value={
                      Array.isArray(field.value)
                        ? field.value.join(" , ")
                        : field.value
                    }
                  />
                ) : (
                  <motion.div
                    initial={{
                      opacity: 0,
                      filter: "blur(2px)",
                    }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      filter: "blur(0px)",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <NodeViewContent className={`content px-2`} />
                  </motion.div>
                )}
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </NodeViewWrapper>
    </>
  );
};

export const Option = (props: NodeViewProps) => {
  const { parentId, type, isRequired } = props?.node?.attrs as Ioptions;
  const optionLabel = props?.node?.content?.content[0]?.text;
  const isEditable = props.editor.isEditable;

  return (
    <NodeViewWrapper as={"div"} className="w-full">
      <FormField
        name={parentId}
        render={({ field }) => (
          <FormItem className=" relative flex w-full items-center gap-2 rounded-md border-2 border-secondary bg-input/80 dark:bg-input/50 p-2 shadow-xs outline-none  my-2 has-checked:border-secondary has-checked:ring-2 has-checked:ring-ring/50 ">
            <FormControl>
              {type === "single" ? (
                <Input
                  id={optionLabel}
                  className=" size-0 h-7 after:absolute after:inset-0 "
                  type="radio"
                  value={optionLabel}
                  checked={field?.value === optionLabel}
                  onChange={(e) => field?.onChange?.(e?.target?.value)}
                  disabled={isEditable}
                  // required={isRequired}
                />
              ) : (
                <Input
                  id={optionLabel}
                  checked={field?.value?.includes?.(optionLabel) || false}
                  className=" size-0 h-7 after:absolute after:inset-0  "
                  type="checkbox"
                  onChange={(e) => {
                    const checked = e.currentTarget?.checked;

                    if (!field.value) {
                      field.value = [];
                    }

                    return checked
                      ? field?.onChange([...field?.value, optionLabel])
                      : field?.onChange(
                          field?.value?.filter((v: any) => v !== optionLabel),
                        );
                  }}
                  disabled={isEditable}
                  // required={isRequired}
                />
              )}
            </FormControl>
            <FormLabel
              htmlFor={optionLabel}
              aria-label={optionLabel}
              className=" text-sm w-full"
            >
              <NodeViewContent
                // onKeyDown={(e) => e?.key === "Enter" && e?.preventDefault()}
                className=" w-full"
              />
            </FormLabel>
            {/* <FormMessage/> */}
          </FormItem>
        )}
      />
    </NodeViewWrapper>
  );
};

export const DropDownNode = ({
  value = "Select an option",
}: {
  value: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-sm items-center justify-between rounded-lg border border-input bg-background px-3 text-sm font-normal text-foreground shadow-xs transition focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <span className="truncate text-left text-muted-foreground">
            {value}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-sm" align="start">
        <div className="overflow-y-auto p-2">
          <NodeViewContent className="content space-y-1" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
