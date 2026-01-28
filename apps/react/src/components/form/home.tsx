import { useForm } from "@/hooks/use-form";
import { useParams } from "react-router-dom";
import { FormRender } from "./render";
import { Loader } from "lucide-react";
import { useFormRender } from "@/hooks/use-form-render";
import { useFormSteps } from "@/stores/useFormStepper";

export const FormHome = () => {
  const { formId } = useParams();
  const { form, useFormError, useFormLoading } = useForm(formId!);
  const { currentStep } = useFormSteps((s) => s);
  const pages = useFormRender(form);

  if (useFormError) {
    return (
      <div className=" flex items-center justify-center min-h-dvh">
        <p className="text-destructive">Oops , sorry we failed to load form.</p>
      </div>
    );
  }

  if (useFormLoading) {
    return (
      <div className=" flex items-center justify-center min-h-dvh">
        <span className="">
          <Loader className="animate-spin" />
        </span>
      </div>
    );
  }

  if (!form?.form_schema || !pages) {
    return <p>error</p>;
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
