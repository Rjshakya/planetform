import { client } from "@/lib/hc";
import useSWR from "swr";

export type Form =
  | {
      id: string | null;
      name: string;
      form_schema: string;
      creator: string;
      createdAt: string;
      updatedAt: string;
      customerId: string;
      customisation: any;
      closed: boolean | null;
      closedMessage: string | null;
    }
  | undefined;

export const useForm = (formId: string) => {
  const fetcher = () => getFormForRender(formId);
  const { data, error, isLoading } = useSWR(
    formId ? `useForm:${formId}` : null,
    fetcher,
  );
  return { form: data?.form as Form, useFormError: error, useFormLoading: isLoading };
};

export const keyOfuseForm = (formId: string) => `useForm:${formId}`;

export const getFormForRender = async (formId: string) => {
  const res = await client.api.form[":formId"].$get({ param: { formId } });
  const form = await res.json();
  return form;
};

export const deleteForm = async (formId: string) => {
  const res = await client.api.form[":formId"].$delete({ param: { formId } });
  const deleted = await res.json();

  if ("form" in deleted) {
    return deleted.form?.id;
  }

  return deleted;
};
