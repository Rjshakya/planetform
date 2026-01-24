"use client";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { v7 } from "uuid";
import ShortInput from "./view";

interface InsertShortInputParams {
  label: string;
  id: string;
  type: string;
  isRequired: boolean;
  placeholder: string;
}

// Extend the Commands interface to include your custom command

export const shortInputNode = Node.create({
  name: "shortInput",
  group: "block",
  draggable: true,
  allowGapCursor: true,
  content: "inline*",

  addAttributes() {
    return {
      id: { default: v7() },
      label: { default: "Label:" },
      placeholder: { default: "" },
      type: { default: "text" },
      isRequired: { default: true },
    };
  },

  parseHTML() {
    return [
      {
        tag: "short-input",
        getAttrs: (element) => {
          if (typeof element === "string") return {};

          return {
            id: element.getAttribute("data-id") || v7(),
            label: element.getAttribute("data-label") || "Label:",
            placeholder: element.getAttribute("data-placeholder") || "",
            type: element.getAttribute("data-type") || "text",
            isRequired: element.getAttribute("data-required") === "true",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "short-input",
      mergeAttributes(HTMLAttributes, {
        "data-id": node.attrs.id,
        "data-label": node.attrs.label,
        "data-placeholder": node.attrs.placeholder,
        "data-type": node.attrs.type,
        "data-required": node.attrs.isRequired,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertShortInput:
        ({ label, id, type, isRequired, placeholder }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "shortInput",
            attrs: { label, id, type, isRequired, placeholder },
            content: label
              ? [{ type: "text", text: label }]
              : [{ type: "text", text: "Label:" }],
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ShortInput);
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
    shortInput: {
      insertShortInput: (params: InsertShortInputParams) => ReturnType;
    };
  }
}
