import { apiClient } from "@/lib/axios";
import { createRespondent, submitResponse } from "@/lib/form-submit";
import { type FieldValues, useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { create } from "zustand";

interface IsubmissionObj {
  form: string;
  form_field: string;
  value: string;
  respondent: string;
}

export interface IformStore {
  getHookForm: () => UseFormReturn<FieldValues, any, FieldValues> | null;
  form: UseFormReturn | null;
  setHookForm: (form: UseFormReturn) => UseFormReturn;
  isSubmitting: boolean;
  handleSubmit: ({
    values,
    formId,
    // step,
    // isEdit,
  }: {
    values: Record<string, string | string[]>;
    formId: string;
    // step: number;
    // isEdit: boolean;
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
  handleSubmit: async ({ values, formId }) => {
    const { creator, customerId } = get();
    if (!creator || !customerId || !values || !formId) return false;

    let respondent = get().respondentId;

    if (!respondent) {
      respondent = (await createRespondent(formId, customerId)) ?? null;
      if (!respondent) return false;
    }

    const submited = await submitResponse({
      data: values,
      formId,
      respondent,
      creator: get().creator || ""
    });

    return submited ? true : false;
  },
  isLastStep: true,
  activeStep: 0,
  maxStep: 0,
  isSingleForm: true,
  respondentId: null,
}));
