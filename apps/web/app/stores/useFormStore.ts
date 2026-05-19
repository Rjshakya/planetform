import { createRespondent, submitResponse } from "@/lib/form-submit";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import { create } from "zustand";

// interface IsubmissionObj {
//   form: string;
//   form_field: string;
//   value: string;
//   respondent: string;
// }

export interface IformStore {
  getHookForm: () => UseFormReturn<FieldValues, any, FieldValues> | null;
  form: UseFormReturn | null;
  setHookForm: (form: UseFormReturn) => UseFormReturn;
  isSubmitting: boolean;
  isSubmitted: boolean;
  handleSubmit: ({
    values,
    formId,
  }: {
    values: Record<string, string | string[]>;
    formId: string;
    path: string;
  }) => Promise<boolean>;
  isSuccess: boolean;
  isLastStep: boolean;
  stepResponses: any[];
  activeStep: number;
  maxStep: number;
  isSingleForm: boolean;
  creator: string | null;
  customerId: string | null;
  respondentId: string | null;
  formId: string | null;
}

export const useFormStore = create<IformStore>((set, get) => ({
  isSuccess: false,
  creator: null,
  customerId: null,
  getHookForm: () => {
    return get()?.form;
  },
  form: null,
  formId: null,
  setHookForm: (form) => {
    set({
      form: form,
    });

    return form;
  },
  stepResponses: [],
  isSubmitting: false,
  isSubmitted: false,
  handleSubmit: async ({ values, formId: formIdFromParam, path }) => {

    const { creator, customerId, formId: formIdFromStore } = get();
    const isPreview = path.includes("/preview")

    if (isPreview) {
      set({ isSubmitted: true });
      return true;
    }

    const formId = formIdFromStore ?? formIdFromParam

    if (!creator || !customerId || !values || !formId) return false;

    let respondentId = get().respondentId;

    if (!respondentId) {
      const freshRespondentId = await createRespondent(formId, customerId)
      if (!freshRespondentId) return false;
      respondentId = freshRespondentId
    }

    const submitted = await submitResponse({
      data: values,
      formId,
      respondent: respondentId,
      creator: get().creator || "",
    });

    if (!submitted) {
      set({ isSubmitted: false });
    } else {
      set({ isSubmitted: true });
    }

    return !!submitted
  },
  isLastStep: true,
  activeStep: 0,
  maxStep: 0,
  isSingleForm: true,
  respondentId: null,
}));
