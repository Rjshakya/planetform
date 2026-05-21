import useSWR, { mutate } from "swr";
import { client } from "@/lib/hc";
import type { ICustomizationStoreState } from "@/stores/customization.types";

export type FormCustomisation = {
  theme: {
    formBackgroundColor?: string | null;
    formTextColor?: string | null;
    buttonColor?: string | null;
    buttonTextColor?: string | null;
    checkboxColor?: string | null;
    inputBackgroundColor?: string | null;
    inputFocusColor?: string | null;
    inputBoxBackgroundColor?: string | null;
    inputBorderColor?: string | null;
    buttonBorderColor?: string | null;
  };
  darkTheme: {
    formBackgroundColor?: string | null;
    formTextColor?: string | null;
    buttonColor?: string | null;
    buttonTextColor?: string | null;
    checkboxColor?: string | null;
    inputBackgroundColor?: string | null;
    inputFocusColor?: string | null;
    inputBoxBackgroundColor?: string | null;
    inputBorderColor?: string | null;
    buttonBorderColor?: string | null;
  };
  typography: {
    formFontFamily?: string | null;
    formFontSize?: string | null;
  };
  layout: {
    formWidth?: string | null;
    inputBoxPadding?: string | null;
    buttonPadding?: string | null;
    radius?: string | null;
    buttonWidth?: string | null;
    buttonHeight?: string | null;
  };
  formColorScheme?: string | null;
  customThankyouMessage?: string | null;

  // Backward-compat flat keys (old persisted data)
  actionBtnColor?: string | null;
  actionBtnTextColor?: string | null;
  actionBtnBorderColor?: string | null;
  actionBtnSize?: string | null;
  formBackgroundColor?: string | null;
  formTextColor?: string | null;
  formFontFamily?: string | null;
  formFontSize?: string | null;
  inputBackgroundColor?: string | null;
  inputBorderColor?: string | null;
  buttonWidth?: string | null;
  buttonHeight?: string | null;
};

export type Form =
  | {
    id: string | null;
    name: string;
    form_schema: any;
    creator: string;
    createdAt: string;
    updatedAt: string;
    customerId: string;
    customisation: ICustomizationStoreState;
    closed: boolean | null;
    closedMessage: string | null;
    closingTime: string | null;
    closeAfterSubmissions: number | null;
    isPasswordProtected: boolean;
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

export const getFormSettings = async (formId: string) => {
  const res = await client.api.form.settings[":formId"].$get({
    param: { formId },
  });
  if (!res.ok) throw new Error("failed to get form settings");

  const data = await res.json();

  return data.settings;
};

export const createNewForm = async (
  workspaceId: string,
  userId: string,
  formName = "Untitled Form",
) => {
  const res = await client.api.form.$post({
    json: {
      formValues: {
        creator: userId,
        form_schema: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: formName }],
            },
            { type: "paragraph" },
          ],
        }),
        name: formName,
        workspace: workspaceId,
      },
      formCustomisation: {},
    },
  });

  if (!res.ok) {
    const error = await res.json()
    throw error
  }
  const data = await res.json();
  return data.form as { shortId: string };
};
