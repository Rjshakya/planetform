import type { Content } from "@tiptap/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface IEditorContentStore {
  content: Content | string;
}

export const useEditorContentStore = create<IEditorContentStore>()(
  persist(
    (set, get) => ({
      content: "",
    }),
    {
      name: "editor-store-content",
    },
  ),
);
