import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormStore } from "@/stores/useformStore";
import { NodeViewContent } from "@tiptap/react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { validationFn } from "@/lib/FormFieldValidations";
import { Controller } from "react-hook-form";
import { RequiredIcon } from "../../required-icon";

const ShortInput = (props: NodeViewProps) => {
  const { label, id, type, isRequired, placeholder } = props.node.attrs;
  const editor = props.editor;

  const form = useFormStore.getState().getHookForm();
  return (
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
                <NodeViewContent
                  as="div"
                  className=""
                  onKeyDown={(e) => e?.key === "Enter" && e?.preventDefault()}
                />
                {(isRequired && editor.isEditable) || <RequiredIcon />}
              </div>
            </FieldLabel>
            <Input
              placeholder={placeholder}
              type={type}
              required={isRequired}
              value={field?.value || ""}
              onChange={field?.onChange}
              name={field?.name}
              ref={field?.ref}
              onBlur={field?.onBlur}
              className="min-h-10 form-input-style "
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </NodeViewWrapper>
  );
};

export default ShortInput;
