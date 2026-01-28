import { Editor } from "@tiptap/core";
import { create } from "zustand";

export interface IeditorStore {
  editor: Editor | null;
  isEditable: boolean;
  getEditor: () => Editor | null;
  formBackgroundColor: string | null;
  setFormBackgroundColor: (color: string | null) => void;
  formFontFamily: string | null;
  setformFontFamily: (family: string | null) => void;
  formFontSize: string | null;
  setFormFontSize: (fontSize: string | null) => void;
  actionBtnSize: string | null;
  setActionBtnSize: (size: string | null) => void;
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
  formColorScheme: string | null;
  setFormColorScheme: (scheme: string) => void;
  customThankyouMessage: string | null;
  setCustomThankyouMessage: (msg: string) => void;
  buttonWidth: string | null;
  setButtonWidth: (width: string | null) => void;
  buttonHeight: string | null;
  setButtonHeight: (height: string | null) => void;
}

export interface Icustomisation {
  formBackgroundColor: string | null;
  formFontFamily: string | null;
  formFontSize: string | null;
  actionBtnSize: "icon" | "default" | "sm" | "lg" | null | undefined;
}

export const useCustomizationStore = create<IeditorStore>((set, get) => ({
  editorContent: null,
  openSideBar: false,
  editor: null,
  isEditable: true,
  getEditor: () => get().editor,
  editedContent: null,
  formBackgroundColor: null,
  setFormBackgroundColor: (color: string | null) =>
    set({ formBackgroundColor: color }),
  formFontFamily: null,
  formFontSize: null,
  actionBtnSize: null,
  actionBtnColor: null,
  formTextColor: null,
  actionBtnTextColor: null,
  inputBackgroundColor: null,
  inputBorderColor: null,
  actionBtnBorderColor: null,
  formColorScheme: "dark",
  buttonWidth: null,
  buttonHeight: null,
  setButtonWidth: (width) => set({ buttonWidth: width }),
  setButtonHeight: (height) => set({ buttonHeight: height }),
  setformFontFamily: (family) => set({ formFontFamily: family }),
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
}));
