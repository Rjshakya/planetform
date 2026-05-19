import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { type Theme, useTheme } from "@/components/common/theme-provider";
import { createRespondent } from "@/lib/form-submit";
import { loadFont } from "@/lib/google-fonts";
import { handleMultiPage } from "@/lib/multi-page";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { useEditorStore } from "@/stores/useEditorStore";
import { useFormSteps } from "@/stores/useFormStepper";
import { useFormStore } from "@/stores/useFormStore";
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

  // Compute pages without side effects for SSR safety
  const pages = useMemo(() => {
    if (!formData || !formData.id || !formData?.form_schema) {
      return null;
    }

    return handleMultiPage(formData.form_schema);
  }, [formData]);

  // Apply side effects only on client after hydration
  useEffect(() => {
    // if (typeof window === "undefined") return;

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

    const customization = formData?.customisation || {};
    useEditorStore.setState({ isEditable: false });
    setTheme((customization.formColorScheme as Theme) || "dark");
    useFormStore.setState({
      creator: formData?.creator,
      customerId: formData?.creator,
      formId: formData?.id
    });
    useFormSteps.setState({ totalSteps: (pages?.length || 0) - 1 });
    handleCreateRespondent(formData.id, formData?.creator);
  }, [form, formData, getHookForm, handleCreateRespondent, setTheme, pages]);

  // Load Google Font when formFontFamily is available
  useEffect(() => {
    if (!formData?.customisation) {
      return;
    }

    const { customisation } = formData;
    useCustomizationStore.setState({ ...customisation });
    if (customisation?.typography?.formFontFamily) {
      loadFont(customisation?.typography?.formFontFamily);
    }
  }, [formData]);

  if (!formData || !pages) {
    return null;
  }

  return pages;
};
