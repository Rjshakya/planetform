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
import { InsertEmailInputParams } from "./node";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { validationFn } from "../FormFieldValidations";
import {
  useConditionalIndicators,
  useConditionalVisibility,
} from "@/hooks/use-conditional-visibility";
import { Badge } from "@/components/ui/badge";
import { GitBranch } from "lucide-react";

export const EmailInput = (props: NodeViewProps) => {
  const { label, id, type, isRequired, placeholder, prefix } = props?.node
    ?.attrs as InsertEmailInputParams;

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
          rules={{ validate: validationFn({ isRequired, type: "emailInput" }) }}
          render={({ field }) => (
            <FormItem className={`mt-4 field gap-3`}>
              <FormLabel
                htmlFor={label}
                aria-label={label}
                className=" text-md pl-1"
                id={id}
              >
                <div className="flex items-center gap-2">
                  <NodeViewContent
                    // onKeyDown={(e) => e?.key === "Enter" && e?.preventDefault()}
                    as="div"
                    className="min-w-5 w-full"
                  />
                  {isControlled && props.editor?.isEditable && (
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                      <GitBranch className="h-2 w-2 mr-1" />
                      Logic
                    </Badge>
                  )}
                </div>
              </FormLabel>
              <FormControl className="">
                <InputGroup>
                  <InputGroupInput
                    className="pl-1!"
                    placeholder={placeholder}
                    type={type}
                    required={isRequired}
                    value={field?.value || ""}
                    onChange={field?.onChange}
                    name={field?.name}
                    disabled={props?.editor?.isEditable}
                    ref={field?.ref}
                    onBlur={field?.onBlur}
                  />
                  <InputGroupAddon>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className=" size-5 fill-foreground"
                        viewBox="0 0 24 24"
                        fill="#fff"
                      >
                        <g clipPath="url(#clip0_4418_8178)">
                          <path
                            d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z"
                            fill="white"
                            style={{ fill: "var(--fillg)" }}
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_4418_8178">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </NodeViewWrapper>
    </>
  );
};
