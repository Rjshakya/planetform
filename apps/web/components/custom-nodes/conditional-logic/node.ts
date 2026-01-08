"use client";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { v7 } from "uuid";
import ConditionalLogicView from "./View";

export interface Condition {
  id: string;
  fieldId: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "is_empty"
    | "is_not_empty";
  value: string | number;
}

export interface ConditionalLogicAttrs {
  id: string;
  conditions: Condition[];
  targetFieldIds: string[];
  logicOperator: "AND" | "OR";
  action: "show" | "hide";
}

interface InsertConditionalLogicParams {
  id: string;
  conditions: Condition[];
  targetFieldIds: string[];
  logicOperator: "AND" | "OR";
  action: "show" | "hide";
}

export const conditionalLogicNode = Node.create({
  name: "conditionalLogic",
  group: "block",
  draggable: true,
  allowGapCursor: true,
  content: "inline*",

  addAttributes() {
    return {
      id: { default: v7() },
      conditions: { default: [] },
      targetFieldIds: { default: [] },
      logicOperator: { default: "AND" },
      action: { default: "show" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "conditional-logic",
        getAttrs: (element) => {
          if (typeof element === "string") return {};

          return {
            id: element.getAttribute("data-id") || v7(),
            conditions: JSON.parse(
              element.getAttribute("data-conditions") || "[]",
            ),
            targetFieldIds: JSON.parse(
              element.getAttribute("data-target-field-ids") || "[]",
            ),
            logicOperator: element.getAttribute("data-logic-operator") || "AND",
            action: element.getAttribute("data-action") || "show",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "conditional-logic",
      mergeAttributes(HTMLAttributes, {
        "data-id": node.attrs.id,
        "data-conditions": JSON.stringify(node.attrs.conditions),
        "data-target-field-ids": JSON.stringify(node.attrs.targetFieldIds),
        "data-logic-operator": node.attrs.logicOperator,
        "data-action": node.attrs.action,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertConditionalLogic:
        ({ id, conditions, targetFieldIds, logicOperator, action }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "conditionalLogic",
            attrs: { id, conditions, targetFieldIds, logicOperator, action },
            content: [{ type: "text", text: "Conditional Logic" }],
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ConditionalLogicView);
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from, empty } = selection;

        if ($from.parent.type.name === this.name && $from.parentOffset === 0) {
          return editor.commands.deleteNode(this.name);
        }

        return false;
      },
      Delete: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        if (
          $from.parent.type.name === this.name &&
          $from.parentOffset === $from.parent.content.size
        ) {
          return editor.commands.deleteNode(this.name);
        }

        return false;
      },
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType = any> {
    conditionalLogic: {
      insertConditionalLogic: (
        params: InsertConditionalLogicParams,
      ) => ReturnType;
    };
  }
}
