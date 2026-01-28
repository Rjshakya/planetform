import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { type InsertMultipleChoiceParams } from "./node";

import { useFormStore } from "@/stores/useformStore";
import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { v7 } from "uuid";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { RequiredIcon } from "../../required-icon";

export const MultipleChoiceViewV2 = (props: NodeViewProps) => {
  const { id, label, type, options, isRequired } = props?.node
    ?.attrs as InsertMultipleChoiceParams;

  const editor = props.editor;
  const form = useFormStore.getState().getHookForm();
  const { isEditable } = useCustomizationStore((s) => s);

  const updateOptionLabel = useCallback(
    (optionIndex: number, newLabel: string) => {
      const newOptions = [...options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], label: newLabel };
      props.updateAttributes({ options: newOptions });
    },
    [options, props],
  );

  const addOption = useCallback(
    (label: string) => {
      const _options = [...options];
      _options.push({ id: v7(), isRequired: false, label, parentId: id, type });
      props.updateAttributes({ options: _options });
    },
    [id, options, type, props],
  );

  const remove = useCallback(
    (index: number) => {
      const _options = [...options];
      _options[index] = { ..._options[index], id: "" };
      props.updateAttributes({ options: _options });
    },
    [options, props],
  );

  return (
    <NodeViewWrapper as={"div"} className="mb-4 relative w-full mcq-input">
      <Controller
        name={id}
        control={form?.control}
        render={({ field, fieldState }) => (
          <Field date-invalid={fieldState.invalid} className="gap-3 ">
            <FieldLabel
              htmlFor={label}
              aria-label={label}
              className="text-base flex items-center gap-2  "
              id={id}
            >
              <NodeViewContent />
              {(isRequired && editor.isEditable) || <RequiredIcon />}
            </FieldLabel>

            <div className="mcq-input-choice-box">
              {type === "multiple" ? (
                <div className="grid gap-1">
                  {options?.map((o, i) => {
                    if (!o.id || !o.id.length) return null;
                    const checked = field.value?.includes(o.label) ?? false;
                    return (
                      <div
                        key={i}
                        className={cn(
                          `flex items-center gap-3 p-2 `,
                          `${checked && "border border-primary"}`,
                          "mcq-multiple-choice-option form-input-style ",
                        )}
                      >
                        <Checkbox
                          className={cn(
                            `mcq-checkbox`,
                            "border-primary/40 rounded-sm",
                          )}
                          id={o.id}
                          checked={checked}
                          onCheckedChange={(c) => {
                            const values = field.value ?? [];
                            if (c) {
                              values.push(o.label);
                              return field.onChange(values);
                            }

                            const removed = values.filter(
                              (v: any) => v !== o.label,
                            );
                            field.onChange(removed);
                          }}
                        />
                        {isEditable ? (
                          <input
                            className=" flex-1 appearance-none  focus-visible:ring-0 focus:outline-none"
                            value={o.label}
                            onChange={(e) =>
                              updateOptionLabel(i, e.currentTarget.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addOption(`option-${options.length + 1}`);
                              }

                              if (o.label === "" && e.key === "Backspace") {
                                remove(i);
                              }
                            }}
                          />
                        ) : (
                          <Label
                            className="mcq-checkbox-label text-base w-full cursor-pointer"
                            htmlFor={o.id}
                          >
                            {o.label}
                          </Label>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <RadioGroup value={field?.value} onValueChange={field.onChange}>
                  {options?.map((o, i) => {
                    if (!o.id || !o.id.length) return null;
                    const checked = field?.value === o.label;
                    return (
                      <div
                        key={i}
                        className={cn(
                          `flex items-center justify-end gap-3 p-1.5`,
                          `${checked && "border border-primary"}`,
                          "mcq-multiple-choice-option form-input-style ",
                        )}
                      >
                        <RadioGroupItem
                          className={
                            "sr-only after:absolute after:inset-0 size-0"
                          }
                          value={o.label}
                          id={o.id}
                        />
                        <p className={cn("mcp-single-choice-radio")}>{i + 1}</p>
                        {isEditable ? (
                          <input
                            className="flex-1 appearance-none  focus-visible:ring-0 focus:outline-none"
                            value={o.label}
                            onChange={(e) =>
                              updateOptionLabel(i, e.currentTarget.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addOption(`option-${options.length + 1}`);
                              }

                              if (o.label === "" && e.key === "Backspace") {
                                remove(i);
                              }
                            }}
                          />
                        ) : (
                          <Label
                            className="text-base w-full cursor-pointer"
                            htmlFor={o.id}
                          >
                            {o.label}
                          </Label>
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </div>
          </Field>
        )}
      />
    </NodeViewWrapper>
  );
};
