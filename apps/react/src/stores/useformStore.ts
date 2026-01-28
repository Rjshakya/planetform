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
}

export const useFormStore = create<IformStore>((set, get) => ({
  isSuccess: false,
  creator: null,
  customerId: null,
  getHookForm: () => {
    return get()?.form;
  },
  form: null,
  setHookForm: (form) => {
    set({
      form: form,
    });

    return form;
  },
  stepResponses: [],
  isSubmitting: false,
  isSubmitted: false,
  handleSubmit: async ({ values, formId, path }) => {
    const { creator, customerId } = get();
    const isPreview = path.includes("/preview");

    if (isPreview) {
      console.log(values);
      return true;
    }

    if (!creator || !customerId || !values || !formId) return false;

    let respondent = get().respondentId;
    if (!respondent) {
      respondent = (await createRespondent(formId, customerId)) ?? null;
      if (!respondent) return false;
    }

    const submitted = await submitResponse({
      data: values,
      formId,
      respondent,
      creator: get().creator || "",
    });

    if (!submitted) {
      set({ isSubmitted: false });
    } else {
      set({ isSubmitted: true });
    }

    return submitted ? true : false;
  },
  isLastStep: true,
  activeStep: 0,
  maxStep: 0,
  isSingleForm: true,
  respondentId: null,
}));
