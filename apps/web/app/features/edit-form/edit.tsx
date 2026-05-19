import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { useEditorStore } from "@/stores/useEditorStore";
import { useEffect, useState } from "react";
import { FormRender } from "@/features/form/render";
import { useForm as useHookForm } from "react-hook-form";
import { useFormStore } from "@/stores/useFormStore";
import { convertToStyles } from "@/lib/customization-styles";
import type { Form } from "@/hooks/use-form";

export const EditFormHome = ({ form }: { form: Form }) => {
  const { getHookForm } = useFormStore((s) => s);
  const hookForm = useHookForm();
  const [formState, setFormState] = useState<any>();
  const customizationState = useCustomizationStore((s) => s);

  useEffect(() => {
    if (!getHookForm()) {
      useFormStore.setState({ form: hookForm });
    }

    if (!form?.form_schema) return;
    (() => setFormState(form?.form_schema))();

    const customization = form?.customisation || {};
    useCustomizationStore.setState({ ...customization });
    useEditorStore.setState({ isEditable: true });
  }, [form, hookForm, getHookForm]);

  const bgStyle = convertToStyles(customizationState);

  return (
    formState && (
      <div style={{ backgroundColor: bgStyle["--form-background"] }}>
        <FormRender lastStepIndex={0} content={formState} />
      </div>
    )
  );
};
