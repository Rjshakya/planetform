import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { type Theme, useTheme } from "@/components/common/theme-provider";
import { createRespondent } from "@/lib/form-submit";
import { loadFont } from "@/lib/google-fonts";
import { handleMultiPage } from "@/lib/multi-page";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { useFormSteps } from "@/stores/useFormStepper";
import { useFormStore } from "@/stores/useformStore";
import type { Form } from "./use-form";

export const useFormRender = (formData: Form) => {
  const { getHookForm, respondentId } = useFormStore((s) => s);
  const form = useForm();
  const { setTheme } = useTheme();

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
    setTheme((customization.formColorScheme as Theme) || "dark");
    useFormStore.setState({
      creator: formData?.creator,
      customerId: formData?.creator,
    });
    useFormSteps.setState({ totalSteps: (getPages?.length || 0) - 1 });
    handleCreateRespondent(formData.id, formData?.creator);
    return getPages;
  }, [form, formData, getHookForm, handleCreateRespondent, setTheme]);

  // Load Google Font when formFontFamily is available
  useEffect(() => {
    if (formData?.customisation?.formFontFamily) {
      loadFont(formData.customisation.formFontFamily);
    }
  }, [formData?.customisation?.formFontFamily]);

  if (!formData || !pages) {
    return null;
  }

  return pages;
};
