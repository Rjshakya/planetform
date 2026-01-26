import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormStore } from "@/stores/useformStore";
import { NodeViewContent } from "@tiptap/react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { validationFn } from "@/lib/FormFieldValidations";
// import {
//   useConditionalVisibility,
//   useConditionalIndicators,
// } from "@/hooks/use-conditional-visibility";
// import { Badge } from "@/components/ui/badge";
// import { GitBranch } from "lucide-react";
import { Controller } from "react-hook-form";

const ShortInput = (props: NodeViewProps) => {
  const { label, id, type, isRequired, placeholder } = props.node.attrs;

  const form = useFormStore.getState().getHookForm();
  //   const isVisible = useConditionalVisibility(id);
  //   const { isControlled } = useConditionalIndicators(id);

  //   if (!isVisible && !props?.editor?.isEditable) {
  //     return null;
  //   }

  return (
    <>
      <NodeViewWrapper as={"div"} className="mb-4">
        <Controller
          control={form?.control}
          name={id}
          rules={{
            validate: validationFn({ isRequired, type: "shortInput" }),
          }}
          render={({ field, fieldState }) => (
            <Field className="" data-invalid={fieldState?.invalid}>
              <FieldLabel
                htmlFor={label}
                aria-label={label}
                className="text-base"
                id={id}
              >
                <div className="flex items-center gap-2">
                  <NodeViewContent as="div" className="" onKeyDown={(e) => e?.key === "Enter" && e?.preventDefault()} />
                  {/* {isControlled && props.editor?.isEditable && (
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                      <GitBranch className="h-2 w-2 mr-1" />
                      Logic
                    </Badge>
                  )} */}
                </div>
              </FieldLabel>
              <Input
                placeholder={placeholder}
                type={type}
                required={isRequired}
                value={field?.value || ""}
                onChange={field?.onChange}
                name={field?.name}
                // disabled={props?.editor?.isEditable}
                ref={field?.ref}
                onBlur={field?.onBlur}
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </NodeViewWrapper>
    </>
  );
};

export default ShortInput;
