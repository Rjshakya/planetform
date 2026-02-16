/**
 *  this is main component that render form , where respondents can respond
 *  domain/:formId
 *
 */

import { Loader } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useForm } from "@/hooks/use-form";
import { useFormPasswordAuth } from "@/hooks/use-form-password-auth";
import { useFormRender } from "@/hooks/use-form-render";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { useFormSteps } from "@/stores/useFormStepper";
import { PrevBtn } from "../tiptap/editor";
import { FormRender } from "./render";

// Wrapper component that validates token before showing form
const PasswordProtectedForm = ({
  formId,
  children,
}: {
  formId: string;
  children: React.ReactNode;
}) => {
  const { checkIsAuthenticated, getStoredToken } = useFormPasswordAuth(formId);
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    const validateToken = async () => {
      // First check if token exists
      const token = getStoredToken();
      if (!token) {
        setAuthState("unauthenticated");
        return;
      }

      // Validate token with server
      const isValid = await checkIsAuthenticated();
      setAuthState(isValid ? "authenticated" : "unauthenticated");
    };

    validateToken();
  }, [checkIsAuthenticated, getStoredToken]);

  if (authState === "loading") {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center">
        <Loader className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <Navigate to={`/${formId}/verify`} replace />;
  }

  return <>{children}</>;
};

export const FormHome = () => {
  const { formId } = useParams();
  const { form, useFormError, useFormLoading } = useForm(formId!);
  const { currentStep } = useFormSteps((s) => s);
  const pages = useFormRender(form);
  const { pathname } = useLocation();
  const isPreview = pathname.includes("/preview");
  const { formBackgroundColor } = useCustomizationStore((s) => s);

  // Loading and error states
  if (useFormError) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-destructive">Oops , sorry we failed to load form.</p>
      </div>
    );
  }

  if (useFormLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!form?.form_schema || !pages) {
    return <p>error</p>;
  }

  if (form.closed) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center">
        <p className="text-destructive w-full text-center">Form is closed</p>
      </div>
    );
  }

  // Form content to render
  const formContent = (
    <main
      style={{ backgroundColor: formBackgroundColor || undefined }}
      className="no-scrollbar min-h-dvh flex flex-col items-center justify-center"
    >
      <motion.div layout className="w-full mb-4 max-w-3xl mx-auto">
        <PrevBtn formId={formId} isPreview={isPreview} />
      </motion.div>
      <AnimatePresence mode="popLayout">
        {pages.length > 0 &&
          pages.map((p, i) =>
            currentStep === i ? (
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
            ) : null,
          )}
      </AnimatePresence>
    </main>
  );

  // If password protected and not in preview mode, wrap with auth validation
  if (form.isPasswordProtected && !isPreview) {
    return (
      <PasswordProtectedForm formId={formId!}>
        {formContent}
      </PasswordProtectedForm>
    );
  }

  return formContent;
};
