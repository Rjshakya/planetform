import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import UniqueID from "@tiptap/extension-unique-id";
import type { Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ImagePlaceholder } from "./extenstions/image-placeholder";
import { fieldMentionSuggestion } from "./field-mention-suggestions";
import { dateInputNode } from "./form-nodes/date-input/node";
import { emailInputNode } from "./form-nodes/email/node";
import { fieldReferenceNode } from "./form-nodes/field-reference/node";
import { fileUploadNode } from "./form-nodes/file-upload/node";
import { longInputNode } from "./form-nodes/long-input/node";
import { multipleChoiceNode } from "./form-nodes/multiple-choice/node";
import { multiPageNode } from "./form-nodes/page-node/node";
import { shortInputNode } from "./form-nodes/short-input/node";
import { suggestion } from "./slash-suggestions";
import { ImageExtension } from "./extenstions/image";

export const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
  Placeholder.configure({
    emptyNodeClass: "is-editor-empty",
    includeChildren: false,
    placeholder: "Write, type '/' for commands",
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle,
  Subscript,
  Superscript,
  Underline,
  Link,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  // Image.configure({
  //   resize: {
  //     enabled: true,
  //     alwaysPreserveAspectRatio: true,
  //   },
  // }),
  ImageExtension,
  ImagePlaceholder,
  Typography,
  // Slash command menu (/)
  Mention.configure({
    suggestion,
  }),
  // Field mention menu (@)
  Mention.configure({
    suggestion: fieldMentionSuggestion,
  }),
  UniqueID,
  shortInputNode,
  longInputNode,
  fileUploadNode,
  dateInputNode,
  emailInputNode,
  multipleChoiceNode,
  multiPageNode,
  fieldReferenceNode,
] as Extension[];
