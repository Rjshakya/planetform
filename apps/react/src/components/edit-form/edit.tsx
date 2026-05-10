import { useForm } from "@/hooks/use-form";
import { useCustomizationStore, hydrateCustomization } from "@/stores/useCustomizationStore";
import { useEditorStore } from "@/stores/useEditorStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FormRender } from "../form/render";
import { useForm as useHookForm } from "react-hook-form";
import { useFormStore } from "@/stores/useFormStore";
import { convertToStyles } from "@/lib/customization-styles";

export const EditFormHome = () => {
  const { formId } = useParams();
  const {
    form,
    useFormError: FormError,
    useFormLoading: FormLoading,
  } = useForm(formId!);
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
    useCustomizationStore.setState(hydrateCustomization(customization));
    useEditorStore.setState({ isEditable: true });
  }, [form, hookForm, getHookForm]);

  if (FormError) {
    return <p className="text-destructive">error</p>;
  }

  if (FormLoading) {
    return <p>loading</p>;
  }

  const bgStyle = convertToStyles(customizationState);

  return (
    formState && (
      <div style={{ backgroundColor: bgStyle["--form-background"] }}>
        <FormRender lastStepIndex={0} content={formState} />
      </div>
    )
  );
};
