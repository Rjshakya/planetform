import { NodeViewProps } from "@tiptap/core";
import React from "react";
import { InsertLongInputParams } from "./node";
import { NodeViewWrapper } from "@tiptap/react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormStore } from "@/stores/useformStore";
import { NodeViewContent } from "@tiptap/react";
import { validationFn } from "../FormFieldValidations";
import {
  useConditionalVisibility,
  useConditionalIndicators,
} from "@/hooks/use-conditional-visibility";
import { Badge } from "@/components/ui/badge";
import { GitBranch } from "lucide-react";

export const LongInputView = (props: NodeViewProps) => {
  const { label, id, isRequired, placeholder, rows } = props?.node
    ?.attrs as InsertLongInputParams;

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
          rules={{ validate: validationFn({ isRequired, type: "longInput" }) }}
          render={({ field }) => (
            <FormItem className="mt-4 field gap-3">
              <FormLabel htmlFor={label} className=" text-md pl-1" id={id}>
                <div className="flex items-center gap-2">
                  <NodeViewContent
                    onKeyDown={(e) => e?.key === "Enter" && e?.preventDefault()}
                    as="div"
                    className="outline-none focus:outline-none inline-block min-w-[20px] w-full"
                  />
                  {isControlled && props.editor?.isEditable && (
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                      <GitBranch className="h-2 w-2 mr-1" />
                      Logic
                    </Badge>
                  )}
                </div>
              </FormLabel>
              <FormControl>
                <Textarea
                  required={isRequired}
                  placeholder={placeholder}
                  {...field}
                  rows={rows}
                  disabled={props?.editor?.isEditable}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </NodeViewWrapper>
    </>
  );
};
