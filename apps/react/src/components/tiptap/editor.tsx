import "./tiptap.css";
import { cn } from "@/lib/utils";
import {
  type Editor,
  EditorContent,
  EditorContext,
  type JSONContent,
} from "@tiptap/react";
import { useFormStore } from "@/stores/useformStore";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { PublishForm } from "./publish-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UpdateForm } from "./update-form";
import { CustomizationPanel } from "../customization-panel/customization-panel";
import { useCallback, useState } from "react";
import { toastPromiseOptions } from "@/lib/toast";
import { mutate } from "swr";
import { getUseResponsesKey } from "@/hooks/use-responses";
import { DragHandleComp } from "./drag-handle";
import { ThankyouMessage } from "./thanku-message";
import { usePreviewStore } from "@/stores/usePreviewStore";
import { useFormSteps } from "@/stores/useFormStepper";
import { useFormEditor } from "@/hooks/use-form-editor";
import { ArrowLeft } from "lucide-react";

export function FormEditor({
  className,
  content,
  formClassName,
  lastStepIndex,
}: {
  className?: string;
  content?: JSONContent | string;
  formClassName?: string;
  lastStepIndex: number;
}) {
  const { getHookForm, handleSubmit } = useFormStore((s) => s);
  const { formId } = useParams();
  const { currentStep, handleNext, totalSteps } = useFormSteps((s) => s);
  const { pathname } = useLocation();

  const {
    formBackgroundColor,
    formTextColor,
    formFontFamily,
    formFontSize,
    isEditable,
    actionBtnColor,
    inputBackgroundColor,
  } = useCustomizationStore((s) => s);

  const formStyle = {
    ...(formTextColor && { color: formTextColor }),
    ...(formFontFamily && { fontFamily: `'${formFontFamily}', sans-serif` }),
    ...(formFontSize && { fontSize: formFontSize }),
  };

  const editor = useFormEditor(content || "", isEditable);
  const [isEditablePage] = useState(pathname.includes("/edit"));
  const isPreview = pathname.includes("/preview");
  const form = getHookForm();

  const handleFormSubmit = useCallback(
    async (params: { values: Record<string, string | string[]> }) => {
      if (!form || !formId || pathname.includes("/edit") || !editor) {
        throw new Error("can't submit form while creating");
      }

      const { values } = params;

      if (currentStep === lastStepIndex) {
        await handleSubmit({ values, formId: formId ?? "", path: pathname });
        editor.chain().clearContent().setContent(ThankyouMessage).run();
        form.reset();
        mutate(
          getUseResponsesKey({
            formId: formId ?? "",
            pageIndex: 0,
            pageSize: 20,
          }),
        );
        return;
      }

      return handleNext();
    },
    [
      editor,
      formId,
      pathname,
      handleSubmit,
      form,
      currentStep,
      lastStepIndex,
      handleNext,
    ],
  );

  const submitWithToast = useCallback(
    (values: Record<string, string | string[]>) => {
      return toast.promise(
        async () => await handleFormSubmit({ values }),
        toastPromiseOptions({
          success:
            currentStep === totalSteps ? "Form submitted" : "Step completed",
          loading: "submitting...",
          error:
            currentStep === totalSteps
              ? "Failed to Submit Form"
              : "Step failed",
        }),
      );
    },
    [handleFormSubmit, currentStep, totalSteps],
  );

  if (!editor) return null;
  if (!form) return null;

  return (
    <div
      id="editorParent"
      className={cn(
        `${isEditablePage ? "min-h-dvh" : "flex flex-col items-center justify-center min-h-dvh"}`,
        className,
        `p-5`,
      )}
      style={{
        backgroundColor: formBackgroundColor || undefined,
      }}
    >
      <div className={`max-w-2xl mx-auto w-full relative`}>
        <PrevBtn formId={formId} isPreview={isPreview} />
        <EditorContext.Provider value={{ editor }}>
          {/* Top bar of editor */}
          <TopBar editor={editor} isEditable={isEditable} />

          {/* main form */}
          <form
            id={formId || "vite-react-form"}
            onSubmit={form.handleSubmit(submitWithToast)}
            className={cn(
              `main-form relative w-full overflow-hidden overflow-y-scroll `,
              formClassName,
            )}
            style={
              {
                ...formStyle,
                scrollbarWidth: "none",
                "--input": inputBackgroundColor,
                "--primary": actionBtnColor,
                "--tw-ring-color": formTextColor,
                "--ring": formTextColor,
              } as React.CSSProperties & Record<string, string>
            }
          >
            {isEditablePage && <DragHandleComp editor={editor} />}

            <EditorContent
              editor={editor}
              className=" w-full min-w-full cursor-text sm:px-8 sm:pt-8 px-4  "
            />

            {/* Submit Button */}
            <SubmitButton />
          </form>
        </EditorContext.Provider>
      </div>
    </div>
  );
}

export const PrevBtn = ({
  formId,
  isPreview,
}: {
  formId: string | undefined;
  isPreview: boolean;
}) => {
  const { handlePrev, currentStep, totalSteps } = useFormSteps((s) => s);

  if (currentStep === 0 || currentStep === totalSteps || !formId) {
    return null;
  }

  return (
    <div className="w-full">
      <Button onClick={handlePrev} size={"icon-sm"}>
        <ArrowLeft />
      </Button>
    </div>
  );
};

export const TopBar = ({
  isEditable,
  editor,
}: {
  isEditable: boolean;
  editor: Editor;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setContent } = usePreviewStore((s) => s);

  if (!location.pathname.includes("/edit")) return null;

  return (
    <div className="sticky top-2 z-50 backdrop-blur-lg py-4 px-2 flex items-center justify-between gap-2 mb-3 select-none">
      <div>
        {isEditable ? (
          <span className=" flex gap-3 items-center">
            <p>Editor Mode</p>
            <span className="size-3 bg-green-600  " />
          </span>
        ) : (
          <span className=" flex gap-3 items-center">
            <p>Preview Mode</p>
            <span className="size-3 bg-orange-600 animate-caret-blink " />
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <CustomizationPanel />
        <Button
          variant={"secondary"}
          onClick={() => {
            useCustomizationStore.setState({ isEditable: !isEditable });
            const jsonContent = editor.getJSON();
            setContent(jsonContent);
            navigate("/preview");
          }}
        >
          {isEditable ? "Preview" : "Edit"}
        </Button>

        {location.pathname === "/editor" ? <PublishForm /> : <UpdateForm />}
      </div>
    </div>
  );
};

export const SubmitButton = () => {
  const { pathname } = useLocation();
  const { currentStep, totalSteps } = useFormSteps((s) => s);
  const { isSubmitted } = useFormStore((s) => s);
  const navigate = useNavigate();

  const {
    actionBtnColor,
    actionBtnTextColor,
    actionBtnBorderColor,
    buttonHeight,
    buttonWidth,
  } = useCustomizationStore((s) => s);

  const isEditor = pathname.includes("/edit");
  const isLanding = pathname === "/";

  if (isSubmitted) {
    return null;
  }

  if (isLanding) {
    return (
      <div className="w-full sm:px-8 pb-4 px-4">
        <Button
          style={
            {
              "--primary": actionBtnColor || "",
              color: actionBtnTextColor || "",
              "--tw-ring-color": actionBtnBorderColor,
              width: `${buttonWidth}px`,
              height: `${buttonHeight}px`,
            } as React.CSSProperties & Record<string, string>
          }
          type={"button"}
          onClick={() => navigate("/dashboard")}
        >
          Submit
        </Button>
      </div>
    );
  }

  if (isEditor) {
    return (
      <div className="w-full sm:px-8 pb-4 px-4">
        <Button
          style={
            {
              "--primary": actionBtnColor || "",
              color: actionBtnTextColor || "",
              "--tw-ring-color": actionBtnBorderColor,
              width: `${buttonWidth}px`,
              height: `${buttonHeight}px`,
            } as React.CSSProperties & Record<string, string>
          }
          type={"submit"}
        >
          Submit
        </Button>
      </div>
    );
  }

  return (
    <>
      {
        <div className="w-full sm:px-8 pb-4 px-4">
          <Button
            // size={actionBtnSize ?? "lg"}
            style={
              {
                "--primary": actionBtnColor || "",
                color: actionBtnTextColor || "",
                "--tw-ring-color": actionBtnBorderColor,
              } as React.CSSProperties & Record<string, string>
            }
            type={"submit"}
          >
            {currentStep === totalSteps ? "Submit" : "Next"}
          </Button>
        </div>
      }
    </>
  );
};
