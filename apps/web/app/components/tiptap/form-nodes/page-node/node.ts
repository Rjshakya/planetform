import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MultiPageNodeView } from "./view";

export const multiPageNode = Node.create({
  name: "page",
  group: "block",
  content: "block*",
  draggable: true,
  allowGapCursor: true,

  parseHTML() {
    return [{ tag: "div" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MultiPageNodeView);
  },

  addCommands() {
    return {
      insertPage:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: "page",
            attrs: {},
            content: [
              {
                type: "paragraph",
                attrs: {
                  textAlign: null,
                },
                content: [
                  {
                    type: "text",
                    text: "Start writing here",
                  },
                  {
                    type: "text",
                    text: " ",
                  },
                ],
              },
            ],
          });
        },
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType = any> {
    page: {
      insertPage: () => ReturnType;
    };
  }
}
