import { create } from "zustand";

interface IEditorStore {
  isEditable: boolean;
  setIsEditable: (v: boolean) => void;
}

export const useEditorStore = create<IEditorStore>((set) => ({
  isEditable: true,
  setIsEditable: (v) => set({ isEditable: v }),
}));
