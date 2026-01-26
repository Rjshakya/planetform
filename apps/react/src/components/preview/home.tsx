import { usePreviewFormRender } from "@/hooks/use-preview-form-render";
import { FormRender } from "./render";
import { useFormSteps } from "@/stores/useFormStepper";

export const PreviewHome = () => {
  const pages = usePreviewFormRender();
  const { currentStep } = useFormSteps((s) => s);

  if (!pages) {
    return <div>failed to load form , sorry.</div>;
  }

  return (
    <div>
      {pages.length > 0 &&
        pages.map((p, i) => {
          return (
            currentStep === i && (
              <FormRender content={p} lastStepIndex={pages.length - 1} />
            )
          );
        })}
    </div>
  );
};
