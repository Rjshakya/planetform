"use client";

import Component from "@/components/comp-46";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormStore } from "@/stores/useformStore";
import { NodeViewContent } from "@tiptap/react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import React from "react";
import { validationFn } from "../FormFieldValidations";
import {
  useConditionalVisibility,
  useConditionalIndicators,
} from "@/hooks/use-conditional-visibility";
import { Badge } from "@/components/ui/badge";
import { GitBranch } from "lucide-react";

const ShortInput = (props: NodeViewProps) => {
  const { label, id, type, isRequired, placeholder } = props?.node?.attrs;

  const form = useFormStore.getState().getHookForm();
  const isVisible = useConditionalVisibility(id);
  const { isControlled } = useConditionalIndicators(id);

  if (!isVisible && !props?.editor?.isEditable) {
    return null;
  }

  return (
    <>
      <NodeViewWrapper as={"div"}>
        <FormField
          control={form?.control}
          name={id}
          rules={{
            validate: validationFn({ isRequired, type: "shortInput" }),
          }}
          render={({ field }) => (
            <FormItem className={`mt-4 field gap-3`}>
              <FormLabel
                htmlFor={label}
                aria-label={label}
                className=" text-md pl-1"
                id={id}
              >
                <div className="flex items-center gap-2">
                  <NodeViewContent as="div" className="min-w-5 w-full" />
                  {isControlled && props.editor?.isEditable && (
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                      <GitBranch className="h-2 w-2 mr-1" />
                      Logic
                    </Badge>
                  )}
                </div>
              </FormLabel>
              <FormControl>
                {type === "phone" ? (
                  <Component
                    value={field?.value || ""}
                    valueChange={field?.onChange}
                    id={id}
                    placeholder={placeholder}
                    // disabled={props?.editor?.isEditable}
                  />
                ) : (
                  <Input
                    placeholder={placeholder}
                    type={type}
                    required={isRequired}
                    value={field?.value || ""}
                    onChange={field?.onChange}
                    name={field?.name}
                    disabled={props?.editor?.isEditable}
                    ref={field?.ref}
                    onBlur={field?.onBlur}
                    className=""
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </NodeViewWrapper>
    </>
  );
};

export default ShortInput;
