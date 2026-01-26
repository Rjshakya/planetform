import { createRespondent } from "@/lib/form-submit";
import { useEditorStore } from "@/stores/useEditorStore";
import { useFormStore } from "@/stores/useformStore";
import type { JSONContent } from "@tiptap/core";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Form } from "./use-form";

export const useFormRender = (formData: Form) => {
  const [editorContent, setEditorContent] = useState<JSONContent | string>();
  const { getHookForm, respondentId } = useFormStore((s) => s);
  const form = useForm();

  const handleCreateRespondent = useCallback(
    async (formId: string, customerId: string) => {
      if (respondentId) return;
      const responded = await createRespondent(formId, customerId);
      useFormStore.setState({ respondentId: responded });
    },
    [respondentId],
  );

  useEffect(() => {
    if (!getHookForm()) {
      useFormStore.setState({ form });
    }

    if (
      !formData ||
      !formData.id ||
      !formData?.form_schema ||
      !formData?.creator ||
      !formData?.customerId
    )
      return;

    (() => setEditorContent(formData.form_schema))();

    const customization = formData?.customisation || {};
    useEditorStore.setState({ ...customization, isEditable: false });
    useFormStore.setState({
      creator: formData?.creator,
      customerId: formData?.creator,
    });

    handleCreateRespondent(formData.id, formData?.creator);
  }, [form, formData, getHookForm, handleCreateRespondent]);

  if (!formData) {
    return null;
  }

  return editorContent;
};
