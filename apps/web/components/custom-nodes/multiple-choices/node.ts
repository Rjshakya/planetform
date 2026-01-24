import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { v7 } from "uuid";
import { MultipleChoiceView, Option } from "./View";

export interface Ioptions {
  label: string;
  id: string;
  parentId: string;
  type: string;
  isRequired: boolean;
}

export interface InsertMultipleChoiceParams {
  id: string;
  label: string;
  type: string;
  isDropdown: boolean;
  isRequired: boolean;
}

export const multipleChoiceNode = Node.create({
  name: "multipleChoiceInput",
  group: "block",
  draggable: true,
  allowGapCursor: true,
  content: "block* optionNode*",
  addAttributes() {
    return {
      id: { default: v7() },
      label: { default: "Label:" },
      type: { default: "multiple" },
      isRequired: { default: true },
      isDropdown: { default: false },
    };
  },

  parseHTML() {
    return [
      {
        tag: "multipleChoice-input",
        getAttrs: (element) => {
          if (typeof element === "string") return {};

          return {
            id: element.getAttribute("data-id") || v7(),
            label: element.getAttribute("data-label") || "Label:",
            type: element.getAttribute("data-type") || "text",
            isRequired: element.getAttribute("data-required") === "true",
            isDropdown: element.getAttribute("data-dropdown") || false,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "multipleChoice-input",
      mergeAttributes(HTMLAttributes, {
        "data-id": node.attrs.id,
        "data-label": node.attrs.label,
        "data-type": node.attrs.type,
        "data-required": node.attrs.isRequired,
        "data-dropdown": node.attrs.isDropdown,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertmultipleChoiceInput:
        ({ label, id, type, isDropdown, isRequired }) =>
        ({ commands }) => {
          return commands?.insertContent({
            type: "multipleChoiceInput",
            attrs: { label, id, type, isDropdown, isRequired },
            content: [
              {
                type: "optionNode",
                attrs: { label, id: v7(), parentId: id, type, isRequired },
                content: [{ type: "text", text: "Option-1" }],
              },
            ],
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MultipleChoiceView);
  },

  addKeyboardShortcuts() {
    return {
      Delete: ({ editor }) => {
        const { selection } = editor.state;
        return editor.commands.deleteNode(this.name);
      },
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType = any> {
    multipleChoice: {
      insertmultipleChoiceInput: (
        params: InsertMultipleChoiceParams
      ) => ReturnType;
    };
  }
}

export const optionNode = Node.create({
  name: "optionNode",
  group: "block",
  draggable: true,
  allowGapCursor: true,
  content: "inline*",

  addAttributes() {
    return {
      id: { default: "id" },
      label: { default: "Label:" },
      parentId: { default: "parentId" },
      type: { default: "single" },
      isRequired: { default: true },
    };
  },

  parseHTML() {
    return [
      {
        tag: "option-node",
        getAttrs: (element) => {
          if (typeof element === "string") return {};

          return {
            id: element.getAttribute("data-id") || v7(),
            label: element.getAttribute("data-label") || "Label:",
            type: element.getAttribute("data-type") || "text",
            parentId: element.getAttribute("data-parent-id") || "parentId",
            isRequired: element.getAttribute("data-required") === "true",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "option-node",
      mergeAttributes(HTMLAttributes, {
        "data-id": node.attrs.id,
        "data-label": node.attrs.label,
        "data-type": node.attrs.type,
        "data-parent-id": node.attrs.parentId,
        "data-required": node.attrs.isRequired,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertOption:
        ({ label, id, parentId, type, isRequired }) =>
        ({ commands }) => {
          return commands?.insertContent({
            type: "optionNode",
            attrs: { label, id, parentId, type, isRequired },
            content: [{ type: "text", text: label || "Question:" }],
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(Option);
  },

  // addKeyboardShortcuts() {
  //   return {
  //     Backspace: ({ editor }) => {
  //       const { selection } = editor.state;
  //       const { $from, empty } = selection;

  //       // Check if cursor is at the start of the node content
  //       if ($from.parent.type.name === this.name && $from.parentOffset === 0) {
  //         // Delete the entire node
  //         return editor.commands.deleteNode(this.name);
  //       }

  //       return false; // Let default behavior handle it
  //     },
  //     Delete: ({ editor }) => {
  //       const { selection } = editor.state;
  //       const { $from } = selection;

  //       // Check if cursor is at the end of the node content
  //       if (
  //         $from.parent.type.name === this.name &&
  //         $from.parentOffset === $from.parent.content.size
  //       ) {
  //         // Delete the entire node
  //         return editor.commands.deleteNode(this.name);
  //       }

  //       return false;
  //     },
  //   };
  // },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType = any> {
    multipleChoiceOption: {
      insertOption: (params: Ioptions) => ReturnType;
      addOptionToMultipleChoice: () => ReturnType;
    };
  }
}
