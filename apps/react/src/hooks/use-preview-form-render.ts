import { handleMultiPage } from "@/lib/multi-page";
import { useFormSteps } from "@/stores/useFormStepper";
import { useFormStore } from "@/stores/useformStore";
import { usePreviewStore } from "@/stores/usePreviewStore";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

export const usePreviewFormRender = () => {
  const { content } = usePreviewStore((s) => s);
  const form = useForm({ mode: "all" });

  const pages = useMemo(() => {
    const getMultiplePages = handleMultiPage(content);

    useFormStore.setState({ form });
    useFormSteps.setState({ totalSteps: (getMultiplePages?.length || 0) - 1 });
    return getMultiplePages;
  }, [content, form]);

  return pages;
};
