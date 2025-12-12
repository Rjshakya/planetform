import { v4 } from "uuid";
import { JsonDoc } from "./types";

export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
      },
    },
    {
      type: "heading",
      attrs: {
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "User registration form",
        },
      ],
    },
    {
      type: "shortInput",
      attrs: {
        id: "38889423-cfa0-42cb-8c24-5bd8ee2db8be",
        label: "Short Answer",
        placeholder: "Type anything here",
        type: "text",
        isRequired: true,
      },
      content: [
        {
          type: "text",
          text: "Name",
        },
      ],
    },
    {
      type: "emailInput",
      attrs: {
        id: "019b0f6e-dfba-7571-a148-d419174dd593",
        label: "Email",
        placeholder: "user@planteform.com",
        prefix: "https://",
        type: "email",
        isRequired: true,
      },
      content: [
        {
          type: "text",
          text: "Email",
        },
      ],
    },
    {
      type: "shortInput",
      attrs: {
        id: "019b0f6f-2dfe-73b9-988d-492943849e66",
        label: "Phone Number",
        placeholder: "",
        type: "phone",
        isRequired: true,
      },
      content: [
        {
          type: "text",
          text: "Phone Number",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
      },
    },
  ],
};

export const thankyouPageContent = {
  type: "pageBreak",
  attrs: {
    isThankyouPage: true,
  },
  content: [
    {
      type: "paragraph",
      attrs: {
        textAlign: "center",
      },
      content: [
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                fontFamily: "var(--font-playfair-display)",
              },
            },
          ],
          text: "    ",
        },
        {
          type: "text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                fontFamily: "var(--font-playfair-display)",
              },
            },
            {
              type: "italic",
            },
          ],
          text: "Thankyou for responding",
        },
      ],
    },
  ],
};
