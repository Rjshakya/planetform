import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { v7 } from "uuid";

import { MultipleChoiceViewV2 } from "./view";

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
  type: "single" | "multiple";
  isDropdown: boolean;
  isRequired: boolean;
  options: Ioptions[];
}

export const multipleChoiceNode = Node.create({
  name: "multipleChoiceInput",
  group: "block",
  draggable: true,
  allowGapCursor: true,
  content: "inline*",

  addAttributes() {
    const parentId = v7();
    return {
      id: { default: parentId },
      label: { default: "Label:" },
      type: { default: "single" },
      isRequired: { default: true },
      isDropdown: { default: false },
      options: [
        {
          id: v7(),
          isRequired: true,
          label: "option-1",
          parentId,
          type: "single",
        },
      ],
    };
  },

  parseHTML() {
    return [
      {
        tag: "multiple-choice-input",
        getAttrs: (element) => {
          if (typeof element === "string") return {};
          return {
            id: element.getAttribute("data-id"),
            label: element.getAttribute("data-label"),
            type: element.getAttribute("data-type"),
            isRequired: element.getAttribute("data-required") === "true",
            isDropdown: element.getAttribute("data-dropdown") === "true",
            // options: will use default from addAttributes()
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "multiple-choice-input",
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
        ({ label, id, type, isDropdown, isRequired, options }) =>
        ({ commands }) => {
          return commands?.insertContent({
            type: "multipleChoiceInput",
            attrs: { label, id, type, isDropdown, isRequired, options },
            // content: [
            //   {
            //     type: "optionNode",
            //     attrs: { label, id: v7(), parentId: id, type, isRequired },
            //     content: [{ type: "text", text: "Option-1" }],
            //   },
            // ],
            content: label
              ? [{ type: "text", text: label }]
              : [{ type: "text", text: "Label:" }],
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MultipleChoiceViewV2);
  },

  addKeyboardShortcuts() {
    return {
      Delete: ({ editor }) => {
        return editor.commands.deleteNode(this.name);
      },
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType = any> {
    multipleChoice: {
      insertmultipleChoiceInput: (
        params: InsertMultipleChoiceParams,
      ) => ReturnType;
    };
  }
}
