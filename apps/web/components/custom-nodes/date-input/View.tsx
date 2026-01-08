import { useFormStore } from "@/stores/useformStore";
import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { NodeViewProps } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { InsertDateInputParams } from "./node";
import { validationFn } from "../FormFieldValidations";
import { useConditionalVisibility } from "@/hooks/use-conditional-visibility";

export const DateInputView = (props: NodeViewProps) => {
  const form = useFormStore.getState().getHookForm();
  const { id, label, placeholder, isRequired } = props?.node
    ?.attrs as InsertDateInputParams;
  const isVisible = useConditionalVisibility(id);

  if (!isVisible && !props?.editor?.isEditable) {
    return null;
  }

  return (
    <NodeViewWrapper as={"div"}>
      <FormField
        control={form?.control}
        name={id}
        rules={{ validate: validationFn({ isRequired, type: "dateInput" }) }}
        render={({ field }) => (
          <FormItem
            className={`mt-4 field gap-3 ${
              props?.selected && "outline-2 outline-primary"
            }`}
          >
            <FormLabel
              htmlFor={label}
              aria-label={label}
              className=" text-md "
              id={id}
            >
              <NodeViewContent
                onKeyDown={(e) => e?.key === "Enter" && e?.preventDefault()}
                as="div"
                className="pl-1 outline-none focus:outline-none inline-block min-w-[20px] w-full"
              />
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    type="button"
                    className={cn(
                      "w-full pl-3 h-[50px] text-left font-normal dark:bg-input/40 bg-input/70 border-secondary border-2 ",
                      !field.value && "text-muted-foreground",
                      "hover:bg-input/70",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>{placeholder || "Pick a date"}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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

            <FormMessage />
          </FormItem>
        )}
      />
    </NodeViewWrapper>
  );
};
