import type { Editor } from "@tiptap/core";
import { useEditorContentStore } from "@/stores/useEditorContent";

let timeOut: any;

export const handleSaveEditorContent = (editor: Editor, time: number = 200) => {
  const content = editor.getJSON();

  if (timeOut) clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    useEditorContentStore.setState({ content });
  }, time);
};

export interface FormFieldInfo {
  id: string;
  label: string;
  type: string;
  pos: number;
}

const FIELD_TYPES = [
  "shortInput",
  "LongInput",
  "emailInput",
  "dateInput",
  "multipleChoiceInput",
  "fileUploadInput",
];

export function extractFieldsFromEditor(editor: Editor): FormFieldInfo[] {
  const fields: FormFieldInfo[] = [];

  editor.state.doc.descendants((node, pos) => {
    if (FIELD_TYPES.includes(node.type.name)) {
      fields.push({
        id: node.attrs.id as string,
        label: node.content.content[0].text || (node.attrs.label as string),
        type: node.type.name,
        pos,
      });
    }
  });

  return fields;
}

export function getPreviousFields(
  editor: Editor,
  currentPos: number,
): FormFieldInfo[] {
  const allFields = extractFieldsFromEditor(editor);
  return allFields.filter((field) => field.pos < currentPos);
}
