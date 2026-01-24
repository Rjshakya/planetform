import { type NodeViewProps } from "@tiptap/core";
import { type InsertLongInputParams } from "./node";
import { NodeViewWrapper } from "@tiptap/react";

import { Textarea } from "@/components/ui/textarea";
import { useFormStore } from "@/stores/useformStore";
import { NodeViewContent } from "@tiptap/react";
import { validationFn } from "@/lib/FormFieldValidations";
// import {
//   useConditionalVisibility,
//   useConditionalIndicators,
// } from "@/hooks/use-conditional-visibility";

import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export const LongInputView = (props: NodeViewProps) => {
  const { label, id, isRequired, placeholder, rows } = props?.node
    ?.attrs as InsertLongInputParams;

  const form = useFormStore.getState().getHookForm();
  return (
    <>
      <NodeViewWrapper as={"div"} className="mb-4">
        <Controller
          control={form?.control}
          name={id}
          rules={{ validate: validationFn({ isRequired, type: "longInput" }) }}
          render={({ field, fieldState }) => (
            <Field className="" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={label} className="text-base" id={id}>
                <div className="flex items-center gap-2">
                  <NodeViewContent
                    onKeyDown={(e) => e?.key === "Enter" && e?.preventDefault()}
                    as="div"
                    className="outline-none focus:outline-none inline-block min-w-5 w-full"
                  />
                </div>
              </FieldLabel>

              <Textarea
                required={isRequired}
                placeholder={placeholder}
                {...field}
                rows={rows}
                // disabled={!props?.editor?.isEditable}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </NodeViewWrapper>
    </>
  );
};
