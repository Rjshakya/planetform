import { useForm } from "@/hooks/use-form";
import { useEditorStore } from "@/stores/useEditorStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FormRender } from "../form/render";
import { useForm as useHookForm } from "react-hook-form";
import { useFormStore } from "@/stores/useformStore";

export const EditFormHome = () => {
  const { formId } = useParams();
  const { form, useFormError, useFormLoading } = useForm(formId!);
  const { getHookForm } = useFormStore((s) => s);
  const hookForm = useHookForm();
  const [formState, setFormState] = useState<any>();

  useEffect(() => {
    if (!getHookForm()) {
      useFormStore.setState({ form: hookForm });
    }

    if (!form?.form_schema) return;
    (() => setFormState(form?.form_schema))();

    const customization = form?.customisation || {};
    useEditorStore.setState({ ...customization, isEditable: true });
  }, [form, hookForm, getHookForm]);

  if (useFormError) {
    return <p className="text-destructive">error</p>;
  }

  if (useFormLoading) {
    return <p>loading</p>;
  }

  return formState && <FormRender content={formState} />;
};
