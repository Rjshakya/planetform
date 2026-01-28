import { client } from "@/lib/hc";
import useSWR from "swr";

export type Form =
  | {
      id: string | null;
      name: string;
      form_schema: any;
      creator: string;
      createdAt: string;
      updatedAt: string;
      customerId: string;
      customisation: {
        formBackgroundColor: string | null;
        formFontFamily: string | null;
        formFontSize: string | null;
        actionBtnSize: string | null;
        actionBtnColor: string | null;
        formTextColor: string | null;
        actionBtnTextColor: string | null;
        inputBackgroundColor: string | null;
        inputBorderColor: string | null;
        actionBtnBorderColor: string | null;
        formColorScheme: string | null;
        customThankyouMessage: string | null;
      };
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
  return {
    form: data?.form as Form,
    useFormError: error,
    useFormLoading: isLoading,
  };
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
