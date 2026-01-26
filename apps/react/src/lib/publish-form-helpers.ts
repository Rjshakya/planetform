import { type JSONContent } from "@tiptap/react";
import { client } from "@/lib/hc";
import { useEditorStore } from "@/stores/useEditorStore";

interface IFormField {
  form: string;
  label: string;
  id?: string | undefined;
  placeholder?: string | null | undefined;
  type?: string | null | undefined;
  subType?: string | null | undefined;
  order: number;
  isRequired: boolean | null | undefined;
  min?: number | null | undefined;
  max?: number | null | undefined;
  file_limit?: string | null | undefined;
  accepted_file_types?: string[] | null | undefined;
  choices?: unknown[] | null | undefined;
  multiple_select?: boolean | null | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
}

export const filterFormFieldsFromContent = (
  jsonContent: JSONContent,
  form: string,
) => {
  const inputNodes = jsonContent.content?.filter((n) =>
    n.type?.includes("Input"),
  );

  const formFields: IFormField[] = inputNodes!.map((f, i) => {
    return {
      form: form,
      label: f?.content?.[0]?.text?.trim() || f?.attrs?.label.trim(),
      id: f.attrs?.id,
      type: f?.type,
      subType: f?.attrs?.type,
      order: i,
      isRequired: f?.attrs?.isRequired,
      choices: f?.attrs?.options,
    };
  });

  return formFields;
};

const handleMultiPageFormFields = (doc: JSONContent, form: string) => {
  if (!doc?.content) return;

  const allFormFields = [] as IFormField[];
  const docContent = doc.content;
  const firstPage = docContent.filter((d) => d.type !== "page");
  const firstPageFields = filterFormFieldsFromContent(
    { type: "doc", attrs: {}, content: firstPage },
    form,
  );
  allFormFields.push(...firstPageFields);

  const nextPagesFields = docContent.filter((d) => d.type === "page");
  nextPagesFields.forEach((p) => {
    const content = p;
    const formFields = filterFormFieldsFromContent(content, form);
    allFormFields.push(...formFields);
  });

  return allFormFields;
};

export const postFormFields = async (
  formId: string,
  jsonContent: JSONContent,
) => {
  const formFields = handleMultiPageFormFields(jsonContent, formId);
  if (!formFields) return;

  try {
    await client.api.formField.$post({ json: formFields });
  } catch {
    await client.api.form[":formId"].$delete({ param: { formId } });
  }
};

export const getCustomization = () => {
  const {
    formBackgroundColor,
    formColorScheme,
    formFontFamliy,
    formFontSize,
    formTextColor,
    actionBtnBorderColor,
    actionBtnColor,
    actionBtnSize,
    actionBtnTextColor,
    inputBackgroundColor,
    inputBorderColor,
    customThankyouMessage,
  } = useEditorStore.getState();

  return {
    formBackgroundColor,
    formColorScheme,
    formFontFamliy,
    formFontSize,
    formTextColor,
    actionBtnBorderColor,
    actionBtnColor,
    actionBtnSize,
    actionBtnTextColor,
    inputBackgroundColor,
    inputBorderColor,
    customThankyouMessage,
  };
};
