import { extensions } from "@/components/tiptap/extenstions";
import { useEditorContentStore } from "@/stores/useEditorContent";
import type { EditorView } from "@tiptap/pm/view";
import { useEditor, type Content } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export const useFormEditor = (
  content: Content | string,
  isEditable: boolean,
  slashRef?: React.RefObject<((view: EditorView) => boolean) | null>,
  mentionRef?: React.RefObject<((view: EditorView) => boolean) | null>,
) => {
  const { formId } = useParams();
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editor = useEditor({
    immediatelyRender: false,
    content,
    extensions,
    editorProps: {
      attributes: {
        class: "w-full focus:outline-none",
      },
      handleKeyDown(view, event) {
        if (
          event.key === "/" &&
          !event.ctrlKey &&
          !event.metaKey &&
          slashRef?.current
        ) {
          const handled = slashRef.current(view);
          if (handled) {
            event.preventDefault();
            return true;
          }
        }
        if (
          event.key === "@" &&
          !event.ctrlKey &&
          !event.metaKey &&
          mentionRef?.current
        ) {
          const handled = mentionRef.current(view);
          if (handled) {
            event.preventDefault();
            return true;
          }
        }
        return false;
      },
      handleTextInput(view, _from, _to, text) {
        if (text === "/" && slashRef?.current) {
          const handled = slashRef.current(view);
          if (handled) return true;
        }
        if (text === "@" && mentionRef?.current) {
          const handled = mentionRef.current(view);
          if (handled) return true;
        }
        return false;
      },
    },
    onUpdate(props) {
      // when we have a form id, we don't want to persist the editor state
      // having a form id it means form is live

      // only when form in editor we want to persist its state
      // so that even if user refreshes the page, the form will be in same state

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
