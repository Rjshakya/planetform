import { Editor } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import { type SuggestionOptions } from "@tiptap/suggestion";
import tippy, { type GetReferenceClientRect, type Instance } from "tippy.js";
import {
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  Code2,
  ChevronRight,
  Quote,
  ImageIcon,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CodeSquare,
  TextQuote,
  TextIcon,
} from "lucide-react";
import { SlashMenu } from "./extenstions/slash-component";
import { v7 } from "uuid";
import { toast } from "sonner";

interface CommandItemType {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string;
  command: (editor: Editor) => void;
  group: string;
}

export type CommandGroupType = {
  group: string;
  items: Omit<CommandItemType, "group">[];
};

const groups: CommandGroupType[] = [
  {
    group: "Inputs",
    items: [
      {
        title: "short input",
        keywords: "short input",
        description: "short input",
        icon: TextIcon,
        command(editor) {
          return editor
            .chain()
            .focus()
            .insertShortInput({
              id: v7(),
              isRequired: true,
              label: "Question for short answers",
              placeholder: "write anything",
              type: "text",
            })
            .run();
        },
      },
      {
        title: "long input",
        keywords: "long input",
        description: "long input",
        icon: TextIcon,
        command(editor) {
          return editor
            .chain()
            .focus()
            .insertLongInput({
              id: v7(),
              isRequired: true,
              label: "Question for long answers",
              placeholder: "write anything",
              rows: 6,
            })
            .run();
        },
      },
      {
        title: "email  input",
        keywords: "email  input",
        description: "email  input",
        icon: TextIcon,
        command(editor) {
          return editor
            .chain()
            .focus()
            .insertEmailInput({
              id: v7(),
              isRequired: true,
              label: "Email",
              placeholder: "planetform@gmail.com",
              prefix: "http",
            })
            .run();
        },
      },
      {
        title: "date  input",
        keywords: "date  input",
        description: "date  input",
        icon: TextIcon,
        command(editor) {
          return editor
            .chain()
            .focus()
            .insertDateInput({
              id: v7(),
              isRequired: true,
              label: "Date",
              placeholder: "choose a date",
              type: "",
            })
            .run();
        },
      },
      {
        title: "multiple choice  input",
        keywords: "multiple choice  input",
        description: "multiple choice  input",
        icon: TextIcon,
        command(editor) {
          const parentId = v7();
          return editor
            .chain()
            .focus()
            .insertmultipleChoiceInput({
              id: parentId,
              isRequired: true,
              label: "Question for multiple choices",
              type: "multiple",
              isDropdown: false,
              options: [
                {
                  id: v7(),
                  type: "multiple",
                  isRequired: true,
                  label: "option-1",
                  parentId,
                },
                {
                  id: v7(),
                  type: "multiple",
                  isRequired: true,
                  label: "option-2",
                  parentId,
                },
              ],
            })
            .run();
        },
      },
      {
        title: "single choice  input",
        keywords: "single choice  input",
        description: "single choice  input",
        icon: TextIcon,
        command(editor) {
          const parentId = v7();
          return editor
            .chain()
            .focus()
            .insertmultipleChoiceInput({
              id: parentId,
              isRequired: true,
              label: "Question for single choice",
              type: "single",
              isDropdown: false,
              options: [
                {
                  id: v7(),
                  type: "single",
                  isRequired: true,
                  label: "option-1",
                  parentId,
                },
                {
                  id: v7(),
                  type: "single",
                  isRequired: true,
                  label: "option-2",
                  parentId,
                },
              ],
            })
            .run();
        },
      },
      {
        title: "file upload input",
        keywords: "file upload input",
        description: "file upload input",
        icon: TextIcon,
        command(editor) {
          return editor
            .chain()
            .focus()
            .insertFileUploadInput({
              id: v7(),
              isRequired: true,
              label: "Upload file",
              accept: "*",
              maxFiles: 1,
              maxSize: 5 * 1024 * 1024,
              type: "multiple",
            })
            .run();
        },
      },
      {
        title: "New Page",
        keywords: "New Page",
        description: "New Page",
        icon: TextIcon,
        command(editor) {
          const { selection } = editor.state;
          const mayBePageNode = selection.$from.node(
            selection.$from.blockRange()?.depth,
          );

          if (mayBePageNode.type.name === "page") {
            toast.error("Can't create page inside a page");
            return false;
          }
          return editor.chain().focus().insertPage().run();
        },
      },
    ],
  },
  {
    group: "Basic blocks",
    items: [
      {
        title: "Text",
        description: "Just start writing with plain text",
        icon: ChevronRight,
        keywords: "paragraph text",
        command: (editor) => editor.chain().focus().clearNodes().run(),
      },
      {
        title: "Heading 1",
        description: "Large section heading",
        icon: Heading1,
        keywords: "h1 title header",
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        title: "Heading 2",
        description: "Medium section heading",
        icon: Heading2,
        keywords: "h2 subtitle",
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        title: "Heading 3",
        description: "Small section heading",
        icon: Heading3,
        keywords: "h3 subheader",
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        title: "Bullet List",
        description: "Create a simple bullet list",
        icon: List,
        keywords: "unordered ul bullets",
        command: (editor) => editor.chain().focus().toggleBulletList().run(),
      },
      {
        title: "Numbered List",
        description: "Create a ordered list",
        icon: ListOrdered,
        keywords: "numbered ol",
        command: (editor) => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        title: "Code Block",
        description: "Capture code snippets",
        icon: Code2,
        keywords: "code snippet pre",
        command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      },
      {
        title: "Image",
        description: "Insert an image",
        icon: ImageIcon,
        keywords: "image picture photo",
        command: (editor) =>
          editor.chain().focus().insertImagePlaceholder().run(),
      },
      {
        title: "Horizontal Rule",
        description: "Add a horizontal divider",
        icon: Minus,
        keywords: "horizontal rule divider",
        command: (editor) => editor.chain().focus().setHorizontalRule().run(),
      },
    ],
  },
  {
    group: "Inline",
    items: [
      {
        title: "Quote",
        description: "Capture a quotation",
        icon: Quote,
        keywords: "blockquote cite",
        command: (editor) => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        title: "Code",
        description: "Inline code snippet",
        icon: CodeSquare,
        keywords: "code inline",
        command: (editor) => editor.chain().focus().toggleCode().run(),
      },
      {
        title: "Blockquote",
        description: "Block quote",
        icon: TextQuote,
        keywords: "blockquote quote",
        command: (editor) => editor.chain().focus().toggleBlockquote().run(),
      },
    ],
  },
  {
    group: "Alignment",
    items: [
      {
        title: "Align Left",
        description: "Align text to the left",
        icon: AlignLeft,
        keywords: "align left",
        command: (editor) => editor.chain().focus().setTextAlign("left").run(),
      },
      {
        title: "Align Center",
        description: "Center align text",
        icon: AlignCenter,
        keywords: "align center",
        command: (editor) =>
          editor.chain().focus().setTextAlign("center").run(),
      },
      {
        title: "Align Right",
        description: "Align text to the right",
        icon: AlignRight,
        keywords: "align right",
        command: (editor) => editor.chain().focus().setTextAlign("right").run(),
      },
    ],
  },
];

export const suggestion = {
  items: ({ query }) => {
    return groups
      .map((group) => {
        return {
          group: group.group,
          items: group.items.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.keywords.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase()),
          ),
        };
      })
      .filter((group) => group.items.length > 0);
  },
  render() {
    let component: ReactRenderer;
    let popup: Instance[];

    return {
      onStart(props) {
        component = new ReactRenderer(SlashMenu, {
          editor: props.editor,
          props: props,
        });

        const { selection } = props.editor.state;

        const parentNode = selection.$from.node(selection.$from.depth);
        const blockType = parentNode.type.name;

        if (blockType === "codeBlock") {
          return false;
        }

        if (!props.clientRect) return;
        // if (popup.length) return;
        popup = tippy("#editorParent", {
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },
      onUpdate(props) {
        component?.updateProps(props);

        if (!props.clientRect) return;
        popup?.[0].setProps({
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
        });
      },
      onExit(props) {
        popup?.[0].destroy();
        component.destroy();
      },
      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup?.[0].hide();
          return true;
        }

        const ref = component?.ref as any;
        return ref?.onKeyDown?.(props);
      },
    };
  },
  char: "/",

  // pluginKey:"editor-commands-plugin-key",
} as SuggestionOptions<CommandGroupType, any>;
