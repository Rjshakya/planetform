import { usePreviewFormRender } from "@/hooks/use-preview-form-render";
import { FormRender } from "./render";
import { useFormSteps } from "@/stores/useFormStepper";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { AnimatePresence, motion } from "motion/react";
import { convertToStyles } from "@/lib/customization-styles";

// Buttery smooth spring configuration
const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

// Slide variants for buttery smooth transitions
const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
  }),
};

export const PreviewHome = () => {
  const pages = usePreviewFormRender();
  const customizationState = useCustomizationStore();
  const { currentStep, direction } = useFormSteps((s) => s);

  const formStyle = convertToStyles(customizationState);

  if (!pages) {
    return <div>failed to load form , sorry.</div>;
  }

  return (
    <main
      style={formStyle as React.CSSProperties}
      className="no-scrollbar min-h-dvh flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait" custom={direction}>
          {pages.length > 0 &&
            pages.map(
              (p, i) =>
                currentStep === i && (
                  <motion.div
                    key={i}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={springTransition}
                    className="w-full"
                  >
                    <FormRender content={p} lastStepIndex={pages.length - 1} />
                  </motion.div>
                ),
            )}
        </AnimatePresence>
      </div>
    </main>
  );
};
