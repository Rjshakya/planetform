import type { JSONContent } from "@tiptap/core";
import { create } from "zustand";

export interface IPreviewStore {
  content: JSONContent;
  setContent: (c: JSONContent) => void;
  getContent: () => JSONContent;
}

export const usePreviewStore = create<IPreviewStore>((set, get) => ({
  content: { type: "doc", attrs: {}, content: [] },
  setContent(c) {
    set({ content: c });
  },
  getContent() {
    return get().content;
  },
}));
