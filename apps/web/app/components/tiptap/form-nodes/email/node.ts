"use client";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { v7 } from "uuid";
import { EmailInput } from "./view";

export interface InsertEmailInputParams {
  label: string;
  id: string;
  isRequired: boolean;
  placeholder: string;
  prefix: string;
}

// Extend the Commands interface to include your custom command

export const emailInputNode = Node.create({
  name: "emailInput",
  group: "block",
  draggable: true,
  allowGapCursor: true,
  content: "inline*",

  addAttributes() {
    return {
      id: { default: v7() },
      label: { default: "Label:" },
      placeholder: { default: "planetform.xyz" },
      prefix: { default: "https://" },
      isRequired: { default: true },
    };
  },

  parseHTML() {
    return [
      {
        tag: "email-input",
        getAttrs: (element) => {
          if (typeof element === "string") return {};

          return {
            id: element.getAttribute("data-id") || v7(),
            label: element.getAttribute("data-label") || "Label:",
            placeholder: element.getAttribute("data-placeholder") || "",
            prefix: element.getAttribute("data-prefix") || "",
            isRequired: element.getAttribute("data-required") === "true",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "email-input",
      mergeAttributes(HTMLAttributes, {
        "data-id": node.attrs.id,
        "data-label": node.attrs.label,
        "data-placeholder": node.attrs.placeholder,
        "data-required": node.attrs.isRequired,
        "data-prefix": node.attrs.prefix,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertEmailInput:
        ({ label, id, isRequired, placeholder, prefix }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "emailInput",
            attrs: { label, id, isRequired, placeholder, prefix },
            content: label
              ? [{ type: "text", text: label }]
              : [{ type: "text", text: "Email" }],
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmailInput);
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
    emailInput: {
      insertEmailInput: (params: InsertEmailInputParams) => ReturnType;
    };
  }
}
