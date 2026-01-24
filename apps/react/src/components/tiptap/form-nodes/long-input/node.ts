import { mergeAttributes, Node } from "@tiptap/core";
import { v7 } from "uuid";
import { LongInputView } from "./view";
import { ReactNodeViewRenderer } from "@tiptap/react";

export interface InsertLongInputParams {
  label: string;
  id: string;
  isRequired: boolean;
  placeholder: string;
  rows: number;
}

export const longInputNode = Node.create({
  name: "LongInput",
  group: "block",
  draggable: true,
  allowGapCursor: true,
  content: "inline*",
  addAttributes() {
    return {
      id: { default: v7() },
      label: { default: "Label:" },
      placeholder: { default: "" },
      isRequired: { default: true },
      rows: { default: 8 },
    };
  },

  parseHTML() {
    return [
      {
        tag: "long-input",
        getAttrs: (element) => {
          if (typeof element === "string") return {};

          return {
            id: element.getAttribute("data-id") || v7(),
            label: element.getAttribute("data-label") || "Label:",
            placeholder: element.getAttribute("data-placeholder") || "",
            rows: element.getAttribute("data-rows") || "text",
            isRequired: element.getAttribute("data-required") === "true",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes , node }) {
    return ["long-input",  mergeAttributes(HTMLAttributes, {
        "data-id": node.attrs.id,
        "data-label": node.attrs.label,
        "data-placeholder": node.attrs.placeholder,
        "data-rows": node.attrs.rows,
        "data-required": node.attrs.isRequired,
      }),
      0,];
  },

  addCommands() {
    return {
      insertLongInput:
        ({ label, id, isRequired, placeholder, rows }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "LongInput",
            attrs: {
              label,
              id,
              isRequired,
              placeholder,
              rows,
            },
            content: label
              ? [{ type: "text", text: label}]
              : [{ type: "text", text: "Label:" }],
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(LongInputView);
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from, empty } = selection;

        // Check if cursor is at the start of the node content
        if ($from.parent.type.name === this.name && $from.parentOffset === 0) {
          // Delete the entire node
          return editor.commands.deleteNode(this.name);
        }

        return false; // Let default behavior handle it
      },
      Delete: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        // Check if cursor is at the end of the node content
        if (
          $from.parent.type.name === this.name &&
          $from.parentOffset === $from.parent.content.size
        ) {
          // Delete the entire node
          return editor.commands.deleteNode(this.name);
        }

        return false;
      },
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType = any> {
    longInput: {
      insertLongInput: (params: InsertLongInputParams) => ReturnType;
    };
  }
}
