/**
 *  this is main component that render form , where respondents can respond
 *  domain/:formId
 *
 */

import { useForm } from "@/hooks/use-form";
import { useLocation, useParams } from "react-router-dom";
import { FormRender } from "./render";
import { Loader } from "lucide-react";
import { useFormRender } from "@/hooks/use-form-render";
import { useFormSteps } from "@/stores/useFormStepper";
import { AnimatePresence, motion } from "motion/react";
import { PrevBtn } from "../tiptap/editor";
import { useCustomizationStore } from "@/stores/useCustomizationStore";

export const FormHome = () => {
  const { formId } = useParams();
  const { form, useFormError, useFormLoading } = useForm(formId!);
  const { currentStep } = useFormSteps((s) => s);
  const pages = useFormRender(form);
  const { pathname } = useLocation();
  const isPreview = pathname.includes("/preview");
  const { formBackgroundColor, formFontFamily } = useCustomizationStore(
    (s) => s,
  );

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

  if (form && form.closed) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center">
        <p className="text-destructive w-full text-center">Form is closed</p>
      </div>
    );
  }

  return (
    <main
      style={{
        backgroundColor: formBackgroundColor || undefined,
      }}
      className=" no-scrollbar min-h-dvh flex flex-col items-center justify-center"
    >
      <motion.div
        key={"form-navigation-btn"}
        layout
        className="w-full mb-4 max-w-3xl mx-auto "
      >
        <PrevBtn formId={formId} isPreview={isPreview} />
      </motion.div>
      <AnimatePresence mode="popLayout">
        {pages.length > 0 &&
          pages.map((p, i) => {
            return (
              currentStep === i && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full"
                >
                  <FormRender content={p} lastStepIndex={pages.length - 1} />
                </motion.div>
              )
            );
          })}
      </AnimatePresence>
    </main>
  );
};
