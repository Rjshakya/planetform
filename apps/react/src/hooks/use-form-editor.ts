import { extensions } from "@/components/tiptap/extenstions";
import { useEditorContentStore } from "@/stores/useEditorContent";
import { useEditor, type Content } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export const useFormEditor = (
  content: Content | string,
  isEditable: boolean,
) => {
  const { formId } = useParams();
  const timeOutRef = useRef<any>(null);
  const editor = useEditor({
    immediatelyRender: false,
    content,
    extensions: extensions,
    editorProps: {
      attributes: {
        class: "max-w-full focus:outline-none",
      },
    },
    onUpdate(props) {
      if (formId) return;
      const { editor } = props;
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
      timeOutRef.current = setTimeout(() => {
        useEditorContentStore.setState({ content: editor.getJSON() });
      }, 500);
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(isEditable);
    }
  }, [isEditable, editor]);

  return editor;
};
