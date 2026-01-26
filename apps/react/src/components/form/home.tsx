import { useForm } from "@/hooks/use-form";
// import { useEditorStore } from "@/stores/useEditorStore";
// import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FormRender } from "./render";
// import { useForm as useHookForm } from "react-hook-form";
// import { useFormStore } from "@/stores/useformStore";
// import { createRespondent } from "@/lib/form-submit";
import { Loader } from "lucide-react";
import { useFormRender } from "@/hooks/use-form-render";

export const FormHome = () => {
  const { formId } = useParams();
  const { form, useFormError, useFormLoading } = useForm(formId!);
  // const { getHookForm, respondentId } = useFormStore((s) => s);
  // const hookForm = useHookForm();
  // const [formState, setFormState] = useState<any>();

  // const handleCreateRespondent = useCallback(
  //   async (formId: string, customerId: string) => {
  //     if (respondentId) return;
  //     const responded = await createRespondent(formId, customerId);
  //     useFormStore.setState({ respondentId: responded });
  //   },
  //   [respondentId],
  // );

  // useEffect(() => {
  //   if (!getHookForm()) {
  //     useFormStore.setState({ form: hookForm });
  //   }

  //   if (!formId || !form?.form_schema || !form?.creator || !form?.customerId)
  //     return;

  //   (() => setFormState(form?.form_schema))();

  //   const customization = form?.customisation || {};

  //   useEditorStore.setState({ ...customization, isEditable: false });
  //   useFormStore.setState({
  //     creator: form?.creator,
  //     customerId: form?.creator,
  //   });
  //   handleCreateRespondent(formId, form?.creator);
  // }, [form, hookForm, getHookForm, formId, handleCreateRespondent]);

  const editorContent = useFormRender(form);

  if (useFormError) {
    return (
      <div className=" flex items-center justify-center min-h-dvh">
        <p className="text-destructive">Oops , sorry we failed to load form.</p>
      </div>
    );
  }

  if (useFormLoading) {
    return (
      <div className=" flex items-center justify-center min-h-dvh">
        <span className="">
          <Loader className="animate-spin" />
        </span>
      </div>
    );
  }

  if (!form?.form_schema) {
    return <p>error</p>;
  }

  return (
    editorContent && <FormRender lastStepIndex={0} content={editorContent} />
  );
};
