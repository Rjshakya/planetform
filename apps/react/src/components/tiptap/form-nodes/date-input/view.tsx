import { useFormStore } from "@/stores/useformStore";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type NodeViewProps } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { type InsertDateInputParams } from "./node";
import { validationFn } from "@/lib/FormFieldValidations";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
// import { useConditionalVisibility } from "@/hooks/use-conditional-visibility";

export const DateInputView = (props: NodeViewProps) => {
  const form = useFormStore.getState().getHookForm();
  const { id, label, placeholder, isRequired } = props?.node
    ?.attrs as InsertDateInputParams;
  // const isVisible = useConditionalVisibility(id);

  // if (!isVisible && !props?.editor?.isEditable) {
  //   return null;
  // }

  return (
    <NodeViewWrapper as={"div"} className="mb-8 relative">
      <Controller
        control={form?.control}
        name={id}
        rules={{ validate: validationFn({ isRequired, type: "dateInput" }) }}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState?.invalid}
            className="mt-4 grid"
          >
            <FieldLabel
              htmlFor={label}
              aria-label={label}
              className=" text-base "
              id={id}
            >
              <NodeViewContent
                // onKeyDown={(e) => e?.key === "Enter" && e?.preventDefault()}
                as="div"
                className="pl-1 outline-none focus:outline-none inline-block min-w-5 w-full "
              />

            </FieldLabel>
            <Popover  >
              <PopoverTrigger
                render={
                  <Button
                    variant={"outline"}
                    type="button"
                    className={cn(
                      "pl-3 h-9 text-left font-normal  ",
                      !field.value && "text-muted-foreground",
                      "hover:bg-input/70",
                    )}
                    style={{ width: "288px" }}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>{placeholder || "Pick a date"}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                }
              />

              <PopoverContent side="bottom" className={'w-[288px] items-center'} align="start"  >
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </NodeViewWrapper>
  );
};
