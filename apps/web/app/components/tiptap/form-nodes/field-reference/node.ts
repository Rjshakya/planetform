import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import FieldReferenceView from "./view";

export interface InsertFieldReferenceParams {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
}

export const fieldReferenceNode = Node.create({
  name: "fieldReference",
  group: "inline",
  inline: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      fieldId: {
        default: null,
      },
      fieldLabel: {
        default: "",
      },
      fieldType: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-field-reference]",
        getAttrs: (element) => {
          if (typeof element === "string") return {};

          return {
            fieldId: element.getAttribute("data-field-id"),
            fieldLabel: element.getAttribute("data-field-label"),
            fieldType: element.getAttribute("data-field-type"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-field-reference": "",
        "data-field-id": node.attrs.fieldId,
        "data-field-label": node.attrs.fieldLabel,
        "data-field-type": node.attrs.fieldType,
        class: "field-reference",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertFieldReference:
        ({ fieldId, fieldLabel, fieldType }: InsertFieldReferenceParams) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "fieldReference",
            attrs: {
              fieldId,
              fieldLabel,
              fieldType,
            },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(FieldReferenceView);
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType = any> {
    fieldReference: {
      insertFieldReference: (params: InsertFieldReferenceParams) => ReturnType;
    };
  }
}
