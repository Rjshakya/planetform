import { client } from "@/lib/hc";
import useSWR from "swr";

export type FormField = {
  id: string;
  form: string;
  label: string;
  type: string | null;
  isRequired: boolean | null;
  order: number;
};

export const useFormFields = (formId?: string) => {
  const key = formId ? KeyOfuseFormFields(formId) : null;

  const fetcher = (key: string) => getFormFields(key.split(":")[1]);
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  return {
    formFields: data,
    formFieldsError: error,
    formFieldsLoading: isLoading,
    mutate,
  };
};

export const KeyOfuseFormFields = (formId: string) => {
  return `useFormFields:${formId}`;
};

export const getFormFields = async (formId: string) => {
  const res = await client.api.formField.form[":formId"].$get({
    param: { formId },
  });

  if (!res.ok) throw new Error("failed to get formFields");
  const formFields = await res.json();

  return formFields.formFields;
};
