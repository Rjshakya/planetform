import "./tiptap.css";
import { cn } from "@/lib/utils";
import {
  type Editor,
  EditorContent,
  EditorContext,
  type JSONContent,
} from "@tiptap/react";
import { type EditorView } from "@tiptap/pm/view";
import { useFormStore } from "@/stores/useformStore";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { PublishForm } from "./publish-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UpdateForm } from "./update-form";
import { CustomizationPanel } from "../customization-panel/customization-panel";
import { useCallback, useEffect, useRef, useState } from "react";
import { mutate } from "swr";
import { getUseResponsesKey } from "@/hooks/use-responses";
import { DragHandleComp } from "./drag-handle";
import { ThankyouMessage } from "./thanku-message";
import { usePreviewStore } from "@/stores/usePreviewStore";
import { useFormSteps } from "@/stores/useFormStepper";
import { useFormEditor } from "@/hooks/use-form-editor";
import { loadFont } from "@/lib/google-fonts";
import { SlashCommandMenu } from "./slash-command-palette";
import { FieldMentionMenu } from "./field-mention-palette";

export function FormEditor({
  className,
  content,
  formClassName,
  lastStepIndex,
  wrapperClassName,
}: {
  className?: string;
  content?: JSONContent | string;
  formClassName?: string;
  wrapperClassName?: string;
  lastStepIndex: number;
}) {
  const { getHookForm, handleSubmit } = useFormStore((s) => s);
  const { formId } = useParams();
  const { currentStep, handleNext } = useFormSteps((s) => s);
  const { pathname } = useLocation();

  const {
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

  const [slashOpen, setSlashOpen] = useState(false);
  const slashRef = useRef<
    ((view: EditorView, event: KeyboardEvent) => boolean) | null
  >(null);

  const [mentionOpen, setMentionOpen] = useState(false);
  const mentionRef = useRef<
    ((view: EditorView, event: KeyboardEvent) => boolean) | null
  >(null);

  const editor = useFormEditor(content || "", isEditable, slashRef, mentionRef);
  const [isEditablePage] = useState(pathname.includes("/edit"));
  const form = getHookForm();

  const handleCloseCommandMenu = () => {
    setSlashOpen(false);
    editor?.commands.focus();
  };

  const handleCloseMentionMenu = () => {
    setMentionOpen(false);
    editor?.commands.focus();
  };

  const handleFormSubmit = async (
    values: Record<string, string | string[]>,
  ) => {
    if (!form || pathname.includes("/edit") || !editor) {
      toast.error("can't submit form while creating");
      return;
    }

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
      toast.success("Form submitted successfully");
      return;
    }

    return handleNext();
  };

  // Wire the slash handler so it always sees latest editor / state
  useEffect(() => {
    slashRef.current = (_view, event) => {
      if (!editor || !editor.isEditable) return false;

      const { selection } = editor.state;
      const parentNode = selection.$from.node(selection.$from.depth);
      if (parentNode.type.name === "codeBlock") return false;

      event.preventDefault();
      setSlashOpen(true);
      return true;
    };
  }, [editor]);

  // Wire the mention handler so it always sees latest editor / state
  useEffect(() => {
    mentionRef.current = (_view, event) => {
      if (!editor || !editor.isEditable) return false;

      event.preventDefault();
      setMentionOpen(true);
      return true;
    };
  }, [editor]);

  useEffect(() => {
    if (!formFontFamily) return;
    loadFont(formFontFamily);
  }, []);

  if (!editor) return null;
  if (!form) return null;

  return (
    <div
      id="editorParent"
      className={cn(
        `${isEditablePage ? "min-h-dvh" : "flex flex-col items-center justify-center"}`,
        `p-5`,
        wrapperClassName,
      )}
    >
      <div className={cn(`max-w-2xl mx-auto w-full relative`, className)}>
        <EditorContext.Provider value={{ editor }}>
          {/* Top bar of editor */}
          <TopBar editor={editor} />

          {/* main form */}
          <form
            id={formId || "vite-react-form"}
            onSubmit={form.handleSubmit(handleFormSubmit)}
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
                "--form-label-text": formFontSize,
              } as React.CSSProperties & Record<string, string>
            }
          >
            {isEditablePage && <DragHandleComp editor={editor} />}

            <EditorContent
              editor={editor}
              className="w-full min-w-full cursor-text sm:px-8 sm:pt-8 px-4"
            />

            {/* Submit Button */}
            <SubmitButton />
          </form>
        </EditorContext.Provider>

        <SlashCommandMenu
          editor={editor}
          open={slashOpen}
          onClose={handleCloseCommandMenu}
          onOpenChange={setSlashOpen}
        />

        <FieldMentionMenu
          editor={editor}
          open={mentionOpen}
          onClose={handleCloseMentionMenu}
          onOpenChange={setMentionOpen}
        />
      </div>
    </div>
  );
}

export const PrevBtn = () => {
  const { isSubmitted } = useFormStore((s) => s);
  const { handlePrev, currentStep } = useFormSteps((s) => s);
  const {
    actionBtnColor,
    actionBtnTextColor,
    actionBtnBorderColor,
    buttonHeight,
    buttonWidth,
  } = useCustomizationStore((s) => s);

  if (currentStep === 0 || isSubmitted) {
    return null;
  }

  return (
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
      onClick={handlePrev}
      variant={"default"}
    >
      Back
    </Button>
  );
};

export const TopBar = ({ editor }: { editor: Editor }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const togglePreview = useCallback(() => {
    const jsonContent = editor.getJSON();

    useCustomizationStore.setState({ isEditable: false });
    usePreviewStore.setState({ content: jsonContent });

    navigate("/preview");
  }, [editor, navigate]);

  if (!location.pathname.includes("/edit")) return null;

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg py-4 px-2 flex items-center justify-between gap-2 mb-3 select-none">
      <div>
        <span className=" flex gap-3 items-center">
          <p>Editor Mode</p>
          <span className="size-3 bg-green-600  " />
        </span>
      </div>
      <div className="flex items-center gap-1">
        <CustomizationPanel />
        <Button variant={"secondary"} onClick={togglePreview}>
          Preview
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
      <div className="w-full sm:px-8 px-4">
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
        <div className="w-full sm:px-8 pb-4 px-4 flex gap-2 items-center">
          <PrevBtn />
          <Button
            className={""}
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
            {currentStep === totalSteps ? "Submit" : "Next"}
          </Button>
        </div>
      }
    </>
  );
};
