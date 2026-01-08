"use client";

import * as React from "react";
import { Editor, EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Focus, Placeholder, Selection } from "@tiptap/extensions";

import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { shortInputNode } from "@/components/custom-nodes/shortinput/node";
import { longInputNode } from "@/components/custom-nodes/longinput/node";
import {
  multipleChoiceNode,
  optionNode,
} from "@/components/custom-nodes/multiple-choices/node";

import { useEditorStore } from "@/stores/useEditorStore";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useFormStore } from "@/stores/useformStore";
import { TextStyle, FontFamily } from "@tiptap/extension-text-style";

import { dateInputNode } from "@/components/custom-nodes/date-input/node";
import { conditionalLogicNode } from "@/components/custom-nodes/conditional-logic/node";

import {
  Slash,
  enableKeyboardNavigation,
  createSuggestionsItems,
  SlashCmdProvider,
  SlashCmd,
  renderItems,
} from "@harshtalks/slash-tiptap";

import { v7 } from "uuid";
import { TiptapToolBar } from "./main-toolbar";
import { EditorDragHandle } from "./drag-handle";
import UploadImage from "tiptap-extension-upload-image";
import { apiClient } from "@/lib/axios";
import axios from "axios";
import { fileUploadNode } from "@/components/custom-nodes/file-upload/node";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { emailInputNode } from "@/components/custom-nodes/email/node";
import { Loader } from "lucide-react";

const suggestions = createSuggestionsItems([
  {
    title: "Short Answer",
    searchTerms: [
      "short",
      "text",
      "single line",
      "name",
      "email",
      "short answer",
    ],
    command: ({ editor, range }) => {
      editor
        ?.chain()
        ?.focus()
        ?.deleteRange(range)
        .insertShortInput({
          id: v7(),
          isRequired: true,
          label: "Short Answer",
          placeholder: "write anything here",
          type: "text",
        })
        .run();
    },
    description: "Add a one-line text field",
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className=" size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <g clipPath="url(#clip0_4418_4245)">
            <path
              d="M21 5.25H3C2.59 5.25 2.25 4.91 2.25 4.5C2.25 4.09 2.59 3.75 3 3.75H21C21.41 3.75 21.75 4.09 21.75 4.5C21.75 4.91 21.41 5.25 21 5.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              opacity="0.4"
              d="M12.47 10.25H3C2.59 10.25 2.25 9.91 2.25 9.5C2.25 9.09 2.59 8.75 3 8.75H12.47C12.88 8.75 13.22 9.09 13.22 9.5C13.22 9.91 12.89 10.25 12.47 10.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M21 15.25H3C2.59 15.25 2.25 14.91 2.25 14.5C2.25 14.09 2.59 13.75 3 13.75H21C21.41 13.75 21.75 14.09 21.75 14.5C21.75 14.91 21.41 15.25 21 15.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              opacity="0.4"
              d="M12.47 20.25H3C2.59 20.25 2.25 19.91 2.25 19.5C2.25 19.09 2.59 18.75 3 18.75H12.47C12.88 18.75 13.22 19.09 13.22 19.5C13.22 19.91 12.89 20.25 12.47 20.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_4245">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
  },
  {
    title: "Long Answer",
    searchTerms: ["long", "paragraph", "text area", "feedback", "description"],
    command: ({ editor, range }) => {
      editor
        ?.chain()
        ?.focus()
        ?.deleteRange(range)
        ?.insertLongInput({
          id: v7(),
          isRequired: true,
          label: "Long Answer",
          placeholder: "write anything here",
          rows: 6,
        })
        .run();
    },
    description: "Add a larger text box for longer responses",
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className=" size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <g clipPath="url(#clip0_4418_4245)">
            <path
              d="M21 5.25H3C2.59 5.25 2.25 4.91 2.25 4.5C2.25 4.09 2.59 3.75 3 3.75H21C21.41 3.75 21.75 4.09 21.75 4.5C21.75 4.91 21.41 5.25 21 5.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              opacity="0.4"
              d="M12.47 10.25H3C2.59 10.25 2.25 9.91 2.25 9.5C2.25 9.09 2.59 8.75 3 8.75H12.47C12.88 8.75 13.22 9.09 13.22 9.5C13.22 9.91 12.89 10.25 12.47 10.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M21 15.25H3C2.59 15.25 2.25 14.91 2.25 14.5C2.25 14.09 2.59 13.75 3 13.75H21C21.41 13.75 21.75 14.09 21.75 14.5C21.75 14.91 21.41 15.25 21 15.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              opacity="0.4"
              d="M12.47 20.25H3C2.59 20.25 2.25 19.91 2.25 19.5C2.25 19.09 2.59 18.75 3 18.75H12.47C12.88 18.75 13.22 19.09 13.22 19.5C13.22 19.91 12.89 20.25 12.47 20.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_4245">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
  },
  {
    title: "Email",
    command: ({ editor, range }) => {
      editor
        ?.chain()
        ?.focus()
        ?.deleteRange(range)
        ?.insertEmailInput({
          id: v7(),
          isRequired: true,
          label: "Email",
          placeholder: "user@planteform.com",
          prefix: "https://",
          type: "email",
        })
        .run();
    },
    description: "Add email field",
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <g clipPath="url(#clip0_4418_4516)">
            <path
              opacity="0.4"
              d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M11.9998 12.87C11.1598 12.87 10.3098 12.61 9.65978 12.08L6.52978 9.57997C6.20978 9.31997 6.14978 8.84997 6.40978 8.52997C6.66978 8.20997 7.13978 8.14997 7.45978 8.40997L10.5898 10.91C11.3498 11.52 12.6398 11.52 13.3998 10.91L16.5298 8.40997C16.8498 8.14997 17.3298 8.19997 17.5798 8.52997C17.8398 8.84997 17.7898 9.32997 17.4598 9.57997L14.3298 12.08C13.6898 12.61 12.8398 12.87 11.9998 12.87Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_4516">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
  },
  {
    title: "Phone",
    searchTerms: ["phone", "contact", "number", "mobile"],
    command: ({ editor, range }) => {
      editor
        ?.chain()
        ?.focus()
        ?.deleteRange(range)
        ?.insertShortInput({
          id: v7(),
          isRequired: true,
          label: "Phone Number",
          placeholder: "",
          type: "phone",
        })
        .run();
    },
    description: "Add a field for collecting phone numbers from users.",
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className=" size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <g clipPath="url(#clip0_4418_5170)">
            <path
              d="M19.0599 5.99992L20.2999 4.75992C20.5899 4.46992 20.5899 3.98992 20.2999 3.69992C20.0099 3.40992 19.5299 3.40992 19.2399 3.69992L17.9999 4.93992L16.7599 3.69992C16.4699 3.40992 15.9899 3.40992 15.6999 3.69992C15.4099 3.98992 15.4099 4.46992 15.6999 4.75992L16.9399 5.99992L15.6999 7.23992C15.4099 7.52992 15.4099 8.00992 15.6999 8.29992C15.8499 8.44992 16.0399 8.51992 16.2299 8.51992C16.4199 8.51992 16.6099 8.44992 16.7599 8.29992L17.9999 7.05992L19.2399 8.29992C19.3899 8.44992 19.5799 8.51992 19.7699 8.51992C19.9599 8.51992 20.1499 8.44992 20.2999 8.29992C20.5899 8.00992 20.5899 7.52992 20.2999 7.23992L19.0599 5.99992Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              opacity="0.4"
              d="M11.79 14.21L8.52 17.48C8.16 17.16 7.81 16.83 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.09 13.57 11.44 13.91 11.79 14.21Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M21.9701 18.3291C21.9701 18.6091 21.9201 18.8991 21.8201 19.1791C21.7901 19.2591 21.7601 19.3391 21.7201 19.4191C21.5501 19.7791 21.3301 20.1191 21.0401 20.4391C20.5501 20.9791 20.0101 21.3691 19.4001 21.6191C19.3901 21.6191 19.3801 21.6291 19.3701 21.6291C18.7801 21.8691 18.1401 21.9991 17.4501 21.9991C16.4301 21.9991 15.3401 21.7591 14.1901 21.2691C13.0401 20.7791 11.8901 20.1191 10.7501 19.2891C10.3601 18.9991 9.9701 18.7091 9.6001 18.3991L12.8701 15.1291C13.1501 15.3391 13.4001 15.4991 13.6101 15.6091C13.6601 15.6291 13.7201 15.6591 13.7901 15.6891C13.8701 15.7191 13.9501 15.7291 14.0401 15.7291C14.2101 15.7291 14.3401 15.6691 14.4501 15.5591L15.2101 14.8091C15.4601 14.5591 15.7001 14.3691 15.9301 14.2491C16.1601 14.1091 16.3901 14.0391 16.6401 14.0391C16.8301 14.0391 17.0301 14.0791 17.2501 14.1691C17.4701 14.2591 17.7001 14.3891 17.9501 14.5591L21.2601 16.9091C21.5201 17.0891 21.7001 17.2991 21.8101 17.5491C21.9101 17.7991 21.9701 18.0491 21.9701 18.3291Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_5170">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
  },
  {
    title: "Date",
    command: ({ editor, range }) => {
      const id = v7();
      editor
        ?.chain()
        ?.focus()
        ?.deleteRange(range)
        ?.insertDateInput({
          id,
          isRequired: true,
          label: "Date",
          placeholder: "date",
          type: "Date",
        })
        ?.run();
    },
    description: "Add a field for taking dates from users",
    searchTerms: ["date", "date-input", "birth of date"],
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className=" size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <g clipPath="url(#clip0_4418_5096)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 1.25C8.41421 1.25 8.75 1.58579 8.75 2V5C8.75 5.41421 8.41421 5.75 8 5.75C7.58579 5.75 7.25 5.41421 7.25 5V2C7.25 1.58579 7.58579 1.25 8 1.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 1.25C16.4142 1.25 16.75 1.58579 16.75 2V5C16.75 5.41421 16.4142 5.75 16 5.75C15.5858 5.75 15.25 5.41421 15.25 5V2C15.25 1.58579 15.5858 1.25 16 1.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              opacity="0.4"
              d="M21.5 8.37V17.13C21.5 17.29 21.49 17.45 21.48 17.6H2.52C2.51 17.45 2.5 17.29 2.5 17.13V8.37C2.5 5.68 4.68 3.5 7.37 3.5H16.63C19.32 3.5 21.5 5.68 21.5 8.37Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M21.48 17.5996C21.24 20.0696 19.16 21.9996 16.63 21.9996H7.37002C4.84002 21.9996 2.76002 20.0696 2.52002 17.5996H21.48Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M13.53 11.6198C13.98 11.3098 14.26 10.8498 14.26 10.2298C14.26 8.92976 13.22 8.25977 12 8.25977C10.78 8.25977 9.73 8.92976 9.73 10.2298C9.73 10.8498 10.02 11.3198 10.46 11.6198C9.85 11.9798 9.5 12.5598 9.5 13.2398C9.5 14.4798 10.45 15.2498 12 15.2498C13.54 15.2498 14.5 14.4798 14.5 13.2398C14.5 12.5598 14.15 11.9698 13.53 11.6198ZM12 9.49977C12.52 9.49977 12.9 9.78977 12.9 10.2898C12.9 10.7798 12.52 11.0898 12 11.0898C11.48 11.0898 11.1 10.7798 11.1 10.2898C11.1 9.78977 11.48 9.49977 12 9.49977ZM12 13.9998C11.34 13.9998 10.86 13.6698 10.86 13.0698C10.86 12.4698 11.34 12.1498 12 12.1498C12.66 12.1498 13.14 12.4798 13.14 13.0698C13.14 13.6698 12.66 13.9998 12 13.9998Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_5096">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
  },
  {
    title: "Single Choice",
    searchTerms: ["single choice", "radio", "select one", "yes no", "option"],
    command: ({ editor, range }) => {
      const id = v7();
      const success = editor
        ?.chain()
        ?.focus()
        ?.deleteRange(range)
        .insertmultipleChoiceInput({
          id,
          label: "Single Choice",
          type: "single",
          isDropdown: false,
          isRequired: true,
        })
        .run();

      if (!success) {
        toast.error("failed to insert single input , please try again");
      }
    },
    description: "Add a question where users can select only one answer",
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className=" size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <g clipPath="url(#clip0_4418_5151)">
            <path
              opacity="0.4"
              d="M18.27 3.35C17.8 3.28 17.26 3.25 16.5 3.25H7.5C6.75 3.25 6.2 3.28 5.76 3.34C2.41 3.71 1.75 5.7 1.75 9V15C1.75 18.3 2.41 20.29 5.73 20.65C6.2 20.72 6.74 20.75 7.5 20.75H16.5C17.25 20.75 17.8 20.72 18.24 20.66C21.59 20.29 22.25 18.31 22.25 15V9C22.25 5.7 21.59 3.71 18.27 3.35Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M17 10.75H13.5C13.09 10.75 12.75 10.41 12.75 10C12.75 9.59 13.09 9.25 13.5 9.25H17C17.41 9.25 17.75 9.59 17.75 10C17.75 10.41 17.41 10.75 17 10.75Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M10.1001 11C9.5501 11 9.1001 10.55 9.1001 10C9.1001 9.45 9.5401 9 10.1001 9H10.1101C10.6601 9 11.1101 9.45 11.1101 10C11.1101 10.55 10.6601 11 10.1001 11Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M7.1001 11C6.5501 11 6.1001 10.55 6.1001 10C6.1001 9.45 6.5401 9 7.1001 9C7.6501 9 8.1001 9.45 8.1001 10C8.1001 10.55 7.6601 11 7.1001 11Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M16.9998 16.25H7.01977C6.60977 16.25 6.25977 15.91 6.25977 15.5C6.25977 15.09 6.58977 14.75 6.99977 14.75H16.9998C17.4098 14.75 17.7498 15.09 17.7498 15.5C17.7498 15.91 17.4098 16.25 16.9998 16.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_5151">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
  },
  {
    title: "Multiple Choice",
    searchTerms: [
      "multiple choice",
      "checkbox",
      "select many",
      "choose all",
      "options",
    ],
    command: ({ editor, range }) => {
      const id = v7();
      editor
        ?.chain()
        ?.focus()
        ?.deleteRange(range)
        ?.insertmultipleChoiceInput({
          id,
          label: "Multiple Choice",
          type: "multiple",
          isDropdown: false,
          isRequired: true,
        })
        ?.run();
    },
    description: "Add a question where users can select multiple answer.",
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className=" size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <g clipPath="url(#clip0_4418_5151)">
            <path
              opacity="0.4"
              d="M18.27 3.35C17.8 3.28 17.26 3.25 16.5 3.25H7.5C6.75 3.25 6.2 3.28 5.76 3.34C2.41 3.71 1.75 5.7 1.75 9V15C1.75 18.3 2.41 20.29 5.73 20.65C6.2 20.72 6.74 20.75 7.5 20.75H16.5C17.25 20.75 17.8 20.72 18.24 20.66C21.59 20.29 22.25 18.31 22.25 15V9C22.25 5.7 21.59 3.71 18.27 3.35Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M17 10.75H13.5C13.09 10.75 12.75 10.41 12.75 10C12.75 9.59 13.09 9.25 13.5 9.25H17C17.41 9.25 17.75 9.59 17.75 10C17.75 10.41 17.41 10.75 17 10.75Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M10.1001 11C9.5501 11 9.1001 10.55 9.1001 10C9.1001 9.45 9.5401 9 10.1001 9H10.1101C10.6601 9 11.1101 9.45 11.1101 10C11.1101 10.55 10.6601 11 10.1001 11Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M7.1001 11C6.5501 11 6.1001 10.55 6.1001 10C6.1001 9.45 6.5401 9 7.1001 9C7.6501 9 8.1001 9.45 8.1001 10C8.1001 10.55 7.6601 11 7.1001 11Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M16.9998 16.25H7.01977C6.60977 16.25 6.25977 15.91 6.25977 15.5C6.25977 15.09 6.58977 14.75 6.99977 14.75H16.9998C17.4098 14.75 17.7498 15.09 17.7498 15.5C17.7498 15.91 17.4098 16.25 16.9998 16.25Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_5151">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
  },
  {
    title: "File Upload",
    command: ({ editor, range }) => {
      editor
        ?.chain()
        ?.focus()
        ?.deleteRange(range)
        ?.insertFileUploadInput({
          id: v7(),
          isRequired: true,
          label: "upload file",
          type: "multiple",
          maxFiles: 1,
          maxSize: 5 * 1024 * 1024,
          accept: "*",
        })
        .run();
    },
    description: "Add a file upload field to collect files from users",
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className=" size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <g clipPath="url(#clip0_4418_4823)">
            <path
              opacity="0.4"
              d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M15.8002 2.21048C15.3902 1.80048 14.6802 2.08048 14.6802 2.65048V6.14048C14.6802 7.60048 15.9202 8.81048 17.4302 8.81048C18.3802 8.82048 19.7002 8.82048 20.8302 8.82048C21.4002 8.82048 21.7002 8.15048 21.3002 7.75048C19.8602 6.30048 17.2802 3.69048 15.8002 2.21048Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M11.5299 12.47L9.52994 10.47C9.51994 10.46 9.50994 10.46 9.50994 10.45C9.44994 10.39 9.36994 10.34 9.28994 10.3C9.27994 10.3 9.27994 10.3 9.26994 10.3C9.18994 10.27 9.10994 10.26 9.02994 10.25C8.99994 10.25 8.97994 10.25 8.94994 10.25C8.88994 10.25 8.81994 10.27 8.75994 10.29C8.72994 10.3 8.70994 10.31 8.68994 10.32C8.60994 10.36 8.52994 10.4 8.46994 10.47L6.46994 12.47C6.17994 12.76 6.17994 13.24 6.46994 13.53C6.75994 13.82 7.23994 13.82 7.52994 13.53L8.24994 12.81V17C8.24994 17.41 8.58994 17.75 8.99994 17.75C9.40994 17.75 9.74994 17.41 9.74994 17V12.81L10.4699 13.53C10.6199 13.68 10.8099 13.75 10.9999 13.75C11.1899 13.75 11.3799 13.68 11.5299 13.53C11.8199 13.24 11.8199 12.76 11.5299 12.47Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_4823">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
    searchTerms: ["file upload", "upload", "file", "attachment"],
  },
  {
    title: "Add page",
    command: ({ editor, range }) => {
      editor
        ?.chain()
        ?.focus()
        ?.deleteRange(range)
        .setHorizontalRule()
        .insertContent("<h2>New Page</h2>")
        .insertContent("<p> </p>")
        .insertLongInput({
          id: v7(),
          isRequired: true,
          label: "Ask anything:",
          placeholder: "Type anything here",
          rows: 4,
        })
        .run();
    },
    description: "Add new page for multi-step forms",
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className=" size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <g clipPath="url(#clip0_4418_4830)">
            <path
              opacity="0.4"
              d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M15.8002 2.21048C15.3902 1.80048 14.6802 2.08048 14.6802 2.65048V6.14048C14.6802 7.60048 15.9202 8.81048 17.4302 8.81048C18.3802 8.82048 19.7002 8.82048 20.8302 8.82048C21.4002 8.82048 21.7002 8.15048 21.3002 7.75048C19.8602 6.30048 17.2802 3.69048 15.8002 2.21048Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M12.2799 14.72C11.9899 14.43 11.5099 14.43 11.2199 14.72L10.4999 15.44V11.25C10.4999 10.84 10.1599 10.5 9.74994 10.5C9.33994 10.5 8.99994 10.84 8.99994 11.25V15.44L8.27994 14.72C7.98994 14.43 7.50994 14.43 7.21994 14.72C6.92994 15.01 6.92994 15.49 7.21994 15.78L9.21994 17.78C9.22994 17.79 9.23994 17.79 9.23994 17.8C9.29994 17.86 9.37994 17.91 9.45994 17.95C9.55994 17.98 9.64994 18 9.74994 18C9.84994 18 9.93994 17.98 10.0299 17.94C10.1199 17.9 10.1999 17.85 10.2799 17.78L12.2799 15.78C12.5699 15.49 12.5699 15.01 12.2799 14.72Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_4830">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
    searchTerms: [
      "add page",
      "page",
      "break",
      "new page",
      "multi-step",
      "step",
    ],
  },
  {
    title: "Embed image",
    command: ({ editor, range }) => {
      editor.chain().focus().addImage().run();
    },
    description: "Add images or brand assets in your form",
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className=" size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <g clipPath="url(#clip0_4418_4351)">
            <path
              d="M22.0001 13.8996V16.1896C22.0001 19.8296 19.8301 21.9996 16.1901 21.9996H7.81006C5.26006 21.9996 3.42006 20.9296 2.56006 19.0296L2.67006 18.9496L7.59006 15.6496C8.39006 15.1096 9.52006 15.1696 10.2301 15.7896L10.5701 16.0696C11.3501 16.7396 12.6101 16.7396 13.3901 16.0696L17.5501 12.4996C18.3301 11.8296 19.5901 11.8296 20.3701 12.4996L22.0001 13.8996Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              opacity="0.4"
              d="M20.97 8H18.03C16.76 8 16 7.24 16 5.97V3.03C16 2.63 16.08 2.29 16.22 2C16.21 2 16.2 2 16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.19C2 17.28 2.19 18.23 2.56 19.03L2.67 18.95L7.59 15.65C8.39 15.11 9.52 15.17 10.23 15.79L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9V7.81C22 7.8 22 7.79 22 7.78C21.71 7.92 21.37 8 20.97 8Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M9.00012 10.3801C10.3146 10.3801 11.3801 9.31456 11.3801 8.00012C11.3801 6.68568 10.3146 5.62012 9.00012 5.62012C7.68568 5.62012 6.62012 6.68568 6.62012 8.00012C6.62012 9.31456 7.68568 10.3801 9.00012 10.3801Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
            <path
              d="M20.97 1H18.03C16.76 1 16 1.76 16 3.03V5.97C16 7.24 16.76 8 18.03 8H20.97C22.24 8 23 7.24 23 5.97V3.03C23 1.76 22.24 1 20.97 1ZM21.91 4.93C21.81 5.03 21.66 5.1 21.5 5.11H20.09L20.1 6.5C20.09 6.67 20.03 6.81 19.91 6.93C19.81 7.03 19.66 7.1 19.5 7.1C19.17 7.1 18.9 6.83 18.9 6.5V5.1L17.5 5.11C17.17 5.11 16.9 4.83 16.9 4.5C16.9 4.17 17.17 3.9 17.5 3.9L18.9 3.91V2.51C18.9 2.18 19.17 1.9 19.5 1.9C19.83 1.9 20.1 2.18 20.1 2.51L20.09 3.9H21.5C21.83 3.9 22.1 4.17 22.1 4.5C22.09 4.67 22.02 4.81 21.91 4.93Z"
              fill="white"
              style={{ fill: "var(--fillg)" }}
            />
          </g>
          <defs>
            <clipPath id="clip0_4418_4351">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
    searchTerms: ["image", "assets", "brand"],
  },
  {
    title: "Conditional Logic",
    searchTerms: ["conditional", "logic", "show hide", "rules", "conditions"],
    command: ({ editor, range }) => {
      editor
        ?.chain()
        ?.focus()
        ?.deleteRange(range)
        ?.insertConditionalLogic({
          id: v7(),
          conditions: [],
          targetFieldIds: [],
          logicOperator: "AND",
          action: "show",
        })
        .run();
    },
    description: "Add conditional logic to show/hide fields based on responses",
    icon: (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 fill-foreground"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            fill="white"
            style={{ fill: "var(--fillg)" }}
          />
        </svg>
      </div>
    ),
  },
]);

export function SimpleEditor({
  content,
  isEditable,
}: {
  content?: any;
  isEditable?: boolean;
}) {
  const { formId, workspaceId } = useParams();
  const pathName = usePathname();

  const editorContentRef = React.useRef<HTMLDivElement>(null);
  const { activeStep, maxStep, handleSubmit, isLastStep } = useFormStore(
    (s) => s
  );
  const {
    formBackgroundColor,
    formFontFamliy,
    formFontSize,
    formTextColor,
    inputBackgroundColor,
    inputBorderColor,
    actionBtnColor,
    actionBtnBorderColor,
    actionBtnSize,
    actionBtnTextColor,
  } = useEditorStore((s) => s);

  // form
  const form = useFormStore.getState().getHookForm();

  const handleUpload = async (file: File, editor: Editor | null) => {
    console.log(file.name);

    if (!workspaceId) {
      toast.error("Workspace ID is missing. Cannot upload file.");
      return "";
    }

    const imgs = editor?.$nodes("uploadImage");
    console.log(imgs);

    if (file?.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds the 5MB limit.");
      return "";
    }

    const fileName = file?.name;
    let url = URL.createObjectURL(file);
    const res = await apiClient.post("/api/file/workspace", {
      fileName,
      workspaceId,
    });
    if (res?.status === 200) {
      const signedUrl = res?.data?.url?.uploadUrl;
      url = res?.data?.url?.fileUrl;
      await axios.put(signedUrl, file);
    }
    return url;
  };

  // editor
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "on",
        autocorrect: "off",
        autocapitalize: "on",
        "aria-label": "Main content area, start typing to enter text.",
        class: `flex-1 pt-4`,
      },
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v),
      },
    },
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: true,
          enableClickSelection: true,
        },
      }) as any,
      Slash.configure({
        suggestion: {
          items: ({ query, editor }) => {
            if (!query) {
              return suggestions;
            }

            if (!editor) return [];

            const lowerQuery = query.toLowerCase();
            const filtered = suggestions.filter((item) => {
              if (!item || !item.title) {
                console.warn("Invalid item:", item);
                return false;
              }
              return (
                item.title.toLowerCase().includes(lowerQuery) ||
                item.searchTerms?.some((term) =>
                  term.toLowerCase().includes(lowerQuery)
                )
              );
            });

            return filtered;
          },
          startOfLine: true,
          char: "/",
          allowSpaces: true,
          allowToIncludeChar: true,
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      shortInputNode,
      longInputNode,
      multipleChoiceNode,
      optionNode,
      dateInputNode,
      conditionalLogicNode,
      fileUploadNode,
      emailInputNode,
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
      TextStyle,
      FontFamily,
      Placeholder.configure({
        placeholder: "Press / to open menu",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
      UploadImage.configure({
        uploadFn: (file: File): Promise<string> => handleUpload(file, editor),
      }),
    ],
    editable: isEditable,
    content: content,
    onUpdate(props) {
      if (!isEditable) return;
      if (pathName?.includes("/form/edit")) return;

      setTimeout(() => {
        useEditorStore.setState({ editedContent: props.editor.getJSON() });
      }, 1000);
    },
    onPaste(e, slice) {
      return;
    },
  });

  // page navigation for mutli-step forms.
  const handleActiveIndex = React.useCallback(
    (idx: number) => {
      let index = idx;
      if (index < 0) {
        index = 0;
      }
      if (index > maxStep) {
        index = maxStep + 1;
        useFormStore.setState({
          activeStep: index,
        });
        return;
      }

      useFormStore.setState({
        activeStep: index,
        isLastStep: maxStep === index,
      });
    },
    [maxStep]
  );

  const handleOnSubmit = async (values: FieldValues) => {
    const isSubmitted = await handleSubmit({
      values,
      formId: formId as string,
      step: activeStep,
      isEdit: pathName.includes("/form/edit/"),
    });

    if (isLastStep && isSubmitted) {
      handleActiveIndex(activeStep + 1);
      form?.reset();
      return;
    }

    handleActiveIndex(activeStep + 1);
  };

  if (!editor) {
    return null;
  }

  if (!form) {
    return null;
  }

  return (
    <div
      className={`w-full simple-editor-wrapper selection:bg-blue-200/40 dark:selection:bg-blue-700/40 relative pb-4`}
      style={
        {
          backgroundColor: formBackgroundColor || undefined,
        } as React.CSSProperties & Record<string, string>
      }
    >
      <EditorContext.Provider value={{ editor }}>
        {isEditable && <TiptapToolBar editor={editor} />}

        <Form {...form}>
          <form
            onSubmit={form?.handleSubmit?.(handleOnSubmit, (v) =>
              console.log(v)
            )}
            className={`w-full h-full px-2 grid gap-3 `}
            style={
              {
                fontFamily: formFontFamliy || undefined,
                fontSize: formFontSize || undefined,
                "--input": inputBackgroundColor || undefined,
                color: formTextColor || undefined,
              } as React.CSSProperties & Record<string, string>
            }
            noValidate
          >
            {isEditable && <EditorDragHandle editor={editor} />}
            {isEditable ? (
              <EditorWithSuggestions
                editor={editor}
                editorRef={editorContentRef}
              />
            ) : (
              <EditorContent
                editor={editor}
                role="presentation"
                className="  w-full h-full flex flex-col max-w-lg mx-auto  md:px-1"
                ref={editorContentRef}
              />
            )}
            <div className={`max-w-lg mx-auto px-1 w-full`}>
              <Button
                style={
                  {
                    backgroundColor: actionBtnColor || undefined,
                    "--tw-ring-color": actionBtnBorderColor || actionBtnColor,
                    color: actionBtnTextColor || undefined,
                  } as React.CSSProperties & Record<`--tw-ring-color`, string>
                }
                type="submit"
                size={"lg"}
                onClick={(e) => {
                  if (isEditable) {
                    e.preventDefault();
                    toast.error("Can't submit while creating form");
                  }
                }}
              >
                {isEditable || isLastStep ? (
                  <div className="flex items-center gap-2">
                    <span>Submit</span>
                    {form?.formState.isSubmitting && (
                      <Loader
                        className={`${isEditable || "animate-spin"} ${isEditable && "hidden"}`}
                      />
                    )}
                  </div>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </EditorContext.Provider>
    </div>
  );
}

export function EditorWithSuggestions({
  editor,
  editorRef,
}: {
  editor: Editor;
  editorRef: React.Ref<HTMLDivElement>;
}) {
  return (
    <SlashCmdProvider>
      <EditorContent
        editor={editor}
        role="presentation"
        className={`w-full h-full flex flex-col mx-auto px-1 sm:mt-0  mt-16   relative ${
          editor.isEditable && "max-w-lg mx-auto pb-4"
        }`}
        ref={editorRef}
      />

      <SlashCmd.Root editor={editor}>
        <SlashCmd.Cmd className="max-w-[320px] w-full bg-popover backdrop-blur-2xl rounded-md border shadow-xl dark:bg-popover ">
          <SlashCmd.Empty className="px-4 py-2">
            No commands available
          </SlashCmd.Empty>
          <ScrollArea className="h-[200px] w-full">
            <SlashCmd.List className=" w-full grid gap-5 px-2 py-1 rounded-md font-sans font-medium tracking-tighter cursor-pointer">
              {suggestions?.map?.((item) => {
                return (
                  <SlashCmd.Item
                    value={item?.title}
                    onCommand={(val) => {
                      item?.command?.(val);
                    }}
                    key={item.title}
                    keywords={item.searchTerms}
                    className="flex gap-2 my-1 items-center justify-start pr-2 dark:hover:bg-accent/30 hover:bg-accent/30 hover:backdrop-blur-lg rounded-md dark:border-border/40"
                  >
                    <Button
                      className=" shadow-none"
                      variant={"outline"}
                      size={"icon"}
                    >
                      {item.icon}
                    </Button>
                    <p className="text-sm py-2">{item.title}</p>
                  </SlashCmd.Item>
                );
              })}
            </SlashCmd.List>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </SlashCmd.Cmd>
      </SlashCmd.Root>
    </SlashCmdProvider>
  );
}
