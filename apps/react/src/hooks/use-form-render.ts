import { createRespondent } from "@/lib/form-submit";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { useFormStore } from "@/stores/useformStore";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { Form } from "./use-form";
import { handleMultiPage } from "@/lib/multi-page";
import { useFormSteps } from "@/stores/useFormStepper";

export const useFormRender = (formData: Form) => {
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

  const pages = useMemo(() => {
    if (!getHookForm()) {
      useFormStore.setState({ form });
    }
    if (
      !formData ||
      !formData.id ||
      !formData?.form_schema ||
      !formData?.creator ||
      !formData?.customerId
    ) {
      return;
    }

    const getPages = handleMultiPage(formData.form_schema);
    const customization = formData?.customisation || {};
    useCustomizationStore.setState({ ...customization, isEditable: false });
    useFormStore.setState({
      creator: formData?.creator,
      customerId: formData?.creator,
    });
    useFormSteps.setState({ totalSteps: (getPages?.length || 0) - 1 });
    handleCreateRespondent(formData.id, formData?.creator);
    return getPages;
  }, [form, formData, getHookForm, handleCreateRespondent]);

  if (!formData || !pages) {
    return null;
  }

  return pages;
};
