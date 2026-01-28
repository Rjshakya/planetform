import { useEditorContentStore } from "@/stores/useEditorContent";
import type { Editor } from "@tiptap/core";

let timeOut:any

export const handleSaveEditorContent = (editor: Editor, time: number = 200) => {
  const content = editor.getJSON();

  if (timeOut) clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    useEditorContentStore.setState({ content });
  }, time);


};
