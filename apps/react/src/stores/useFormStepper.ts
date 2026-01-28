import { create } from "zustand";

interface StepperStore {
  currentStep: number;
  handleNext: () => void;
  handlePrev: () => void;
  setTotalSteps: (t: number) => void;
  totalSteps: number;
}

export const useFormSteps = create<StepperStore>((set, get) => ({
  currentStep: 0,
  handleNext: () => {
    const current = get().currentStep + 1;

    if (current > get().totalSteps) return;
    set({ currentStep: current });
  },
  handlePrev: () => {
    const current = get().currentStep - 1;
    if (current < 0) return;
    set({ currentStep: current });
  },
  setTotalSteps: (t) => set({ totalSteps: t }),
  totalSteps: 0,
}));
