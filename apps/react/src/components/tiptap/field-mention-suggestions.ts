import type { Editor } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
  SuggestionProps,
} from "@tiptap/suggestion";
import tippy, { type GetReferenceClientRect, type Instance } from "tippy.js";
import { getPreviousFields } from "@/lib/editor-helpers";
import { FieldMentionMenu } from "./extenstions/field-mention-component";

interface FieldMentionItem {
  id: string;
  label: string;
  type: string;
}

export const fieldMentionSuggestion = {
  items: ({ query, editor }: { query: string; editor: Editor }) => {
    const { from } = editor.state.selection;
    const previousFields = getPreviousFields(editor, from);

    if (!query) {
      return previousFields;
    }

    return previousFields.filter((field) =>
      field.label.toLowerCase().includes(query.toLowerCase()),
    );
  },

  render: () => {
    let component: ReactRenderer;
    let popup: Instance[];

    return {
      onStart(props: SuggestionProps<FieldMentionItem, any>) {
        component = new ReactRenderer(FieldMentionMenu, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) return;

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: SuggestionProps<FieldMentionItem, any>) {
        component?.updateProps(props);

        if (!props.clientRect) return;
        popup?.[0].setProps({
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
        });
      },

      onExit() {
        popup?.[0].destroy();
        component?.destroy();
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        const ref = component?.ref as
          | { onKeyDown?: (props: SuggestionKeyDownProps) => boolean }
          | undefined;
        return ref?.onKeyDown?.(props) ?? false;
      },
    };
  },

  char: "@",
} as unknown as SuggestionOptions<FieldMentionItem, any>;
