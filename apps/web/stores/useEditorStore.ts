import { defaultEditorContent } from "@/lib/content";
import { JsonDoc } from "@/lib/types";
import { Editor } from "@tiptap/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IeditorStore {
  editor: Editor | null;
  getEditor: () => Editor | null;
  content: JsonDoc | null;
  editedContent: JsonDoc | null;
  formBackgroundColor: string | null;
  setFormBackgroundColor: (color: string | null) => void;
  formFontFamliy: string | null;
  setFormFontFamliy: (famliy: string | null) => void;
  formFontSize: string | null;
  setFormFontSize: (fontSize: string | null) => void;
  actionBtnSize: "icon" | "default" | "sm" | "lg" | null | undefined;
  setActionBtnSize: (
    size: "icon" | "default" | "sm" | "lg" | null | undefined
  ) => void;
  actionBtnColor: string | null;
  setActionBtnColor: (color: string | null) => void;
  formTextColor: string | null;
  setFormTextColor: (color: string | null) => void;
  actionBtnTextColor: string | null;
  setActionBtnTextColor: (color: string | null) => void;
  inputBackgroundColor: string | null;
  setInputBackgroundColor: (color: string | null) => void;
  inputBorderColor: string | null;
  setInputBorderColor: (color: string | null) => void;
  actionBtnBorderColor: string | null;
  setActionBtnBorderColor: (color: string | null) => void;
  formColorScheme: string;
  setFormColorScheme: (scheme: string) => void;
  customThankyouMessage: string;
  setCustomThankyouMessage: (msg: string) => void;
  openSideBar: boolean;
  setOpenSideBar: (val: boolean) => void;
}

export interface Icustomisation {
  formBackgroundColor: string | null;
  formFontFamliy: string | null;
  formFontSize: string | null;
  actionBtnSize: "icon" | "default" | "sm" | "lg" | null | undefined;
}

export const useEditorStore = create<IeditorStore>()(
  persist(
    (set, get) => ({
      openSideBar: false,
      editor: null,
      getEditor: () => get().editor,
      content: defaultEditorContent,
      editedContent: null,
      formBackgroundColor: null,
      setFormBackgroundColor: (color: string | null) =>
        set({ formBackgroundColor: color }),
      formFontFamliy: null,
      formFontSize: null,
      actionBtnSize: null,
      actionBtnColor: null,
      formTextColor: null,
      actionBtnTextColor: null,
      inputBackgroundColor: null,
      inputBorderColor: null,
      actionBtnBorderColor: null,
      formColorScheme: "dark",
      setOpenSideBar: (open) => set({ openSideBar: open }),
      setFormFontFamliy: (family) => set({ formFontFamliy: family }),
      setFormFontSize: (size) => set({ formFontSize: size }),
      setActionBtnSize: (size) => set({ actionBtnSize: size }),
      setActionBtnColor: (color) => set({ actionBtnColor: color }),
      setFormTextColor: (color) => set({ formTextColor: color }),
      setActionBtnTextColor: (color) => set({ actionBtnTextColor: color }),
      setInputBackgroundColor: (color) => set({ inputBackgroundColor: color }),
      setInputBorderColor: (color) => set({ inputBorderColor: color }),
      setActionBtnBorderColor: (color) => set({ actionBtnBorderColor: color }),
      setFormColorScheme: (scheme) => set({ formColorScheme: scheme }),

      customThankyouMessage: "Thankyou your responses are submitted",
      setCustomThankyouMessage: (msg) => set({ customThankyouMessage: msg }),
    }),

    {
      name: "planetform-editor",
      partialize: (s) => ({ editedContent: s.editedContent }),
    }
  )
);
