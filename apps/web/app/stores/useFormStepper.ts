import { create } from "zustand";

interface StepperStore {
  currentStep: number;
  direction: number;
  handleNext: () => void;
  handlePrev: () => void;
  setTotalSteps: (t: number) => void;
  totalSteps: number;
  resetStepper: () => void;
}

export const useFormSteps = create<StepperStore>((set, get) => ({
  currentStep: 0,
  direction: 0,
  handleNext: () => {
    const current = get().currentStep + 1;

    if (current > get().totalSteps) return;
    set({ currentStep: current, direction: 1 });
  },
  handlePrev: () => {
    const current = get().currentStep - 1;
    if (current < 0) return;
    set({ currentStep: current, direction: -1 });
  },
  setTotalSteps: (t) => set({ totalSteps: t }),
  totalSteps: 0,
  resetStepper: () => set({ currentStep: 0, direction: 0 }),
}));
