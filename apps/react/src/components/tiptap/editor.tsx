import "./tiptap.css";
import { cn } from "@/lib/utils";
import {
  EditorContent,
  EditorContext,
  useEditor,
  type JSONContent,
} from "@tiptap/react";
import { extensions } from "./extenstions";
import { useFormStore } from "@/stores/useformStore";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useEditorStore } from "@/stores/useEditorStore";
import { PublishForm } from "./publish-form";
import { useLocation, useParams } from "react-router-dom";
import { UpdateForm } from "./update-form";
import { CustomizationPanel } from "../editor/customization-panel";
import { useCallback, useState } from "react";
import { toastPromiseOptions } from "@/lib/toast";
import { mutate } from "swr";
import { getUseResponsesKey } from "@/hooks/use-responses";
import { DragHandleComp } from "./drag-handle";
// import { DragHandleComp } from "./drag-handle";

export function FormEditor({
  className,
  content,
  formClassName,
}: {
  className?: string;
  content?: JSONContent | string;
  formClassName?: string;
}) {
  const { getHookForm, handleSubmit } = useFormStore((s) => s);
  const location = useLocation();
  const { formId } = useParams();

  const {
    formBackgroundColor,
    formTextColor,
    formFontFamliy,
    formFontSize,
    isEditable,
    actionBtnBorderColor,
    actionBtnColor,
    actionBtnSize,
    actionBtnTextColor,
    inputBackgroundColor,
  } = useEditorStore();

  const formStyle = {
    ...(formBackgroundColor && { backgroundColor: formBackgroundColor }),
    ...(formTextColor && { color: formTextColor }),
    ...(formFontFamliy && { fontFamily: formFontFamliy }),
    ...(formFontSize && { fontSize: formFontSize }),
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: extensions,
    content: content,
    editorProps: {
      attributes: {
        class: "max-w-full focus:outline-none",
      },
    },
    editable: isEditable,
  });

  const [isEditablePage] = useState(location.pathname.includes("/edit"));
  const form = getHookForm();

  const handleFormSubmit = useCallback(
    async (params: { values: Record<string, string | string[]> }) => {
      if (!form || !formId || location.pathname.includes("/edit") || !editor) {
        throw new Error("can't submit form while creating");
      }

      const { values } = params;
      await handleSubmit({ values, formId });

      editor
        .chain()
        .clearContent()
        .setContent("<h2>Thankyou for submission</h2>")
        .run();

      form.reset();
      mutate(getUseResponsesKey({ formId, pageIndex: 0, pageSize: 20 }));
    },
    [editor, formId, location.pathname, handleSubmit, form],
  );

  const submitWithToast = useCallback(
    (values: Record<string, string | string[]>) => {
      return toast.promise(
        async () => await handleFormSubmit({ values }),
        toastPromiseOptions({
          success: "form submitted",
          loading: "submitting",
        }),
      );
    },
    [handleFormSubmit],
  );

  if (!editor) return null;
  if (!form) return null;

  return (
    <div id="editorParent" className={cn(" ", className)}>
      <EditorContext.Provider value={{ editor }}>
        {/* Top bar of editor */}
        {location.pathname.includes("/edit") && (
          <div className=" flex items-center justify-between gap-2 mb-3 select-none">
            <div>
              {" "}
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
                  useEditorStore.setState({ isEditable: !isEditable });
                  editor.setEditable(!isEditable);
                }}
              >
                {isEditable ? "Preview" : "Edit"}
              </Button>

              {location.pathname === "/editor" ? (
                <PublishForm />
              ) : (
                <UpdateForm />
              )}
            </div>
          </div>
        )}

        {/* main form */}
        <form
          id="vite-react-form "
          onSubmit={form.handleSubmit(submitWithToast)}
          className={cn(
            `relative w-full grid gap-1 overflow-hidden overflow-y-scroll    ${
              location.pathname.includes("/edit")
                ? "h-[calc(100vh-6rem)]"
                : "h-[calc(100vh-4rem)]"
            } `,
            formClassName,
          )}
          style={
            {
              ...formStyle,
              scrollbarWidth: "none",
              "--input": inputBackgroundColor,
              "--primary": actionBtnColor,
            } as React.CSSProperties & Record<string, string>
          }
        >
          {isEditablePage && <DragHandleComp editor={editor} />}

          <EditorContent
            editor={editor}
            className=" w-full min-w-full cursor-text sm:px-8 sm:pt-8 px-4 font-sans h-full   "
          />

          <div className="w-full sm:px-8 pb-4 px-4">
            <Button
              size={actionBtnSize ?? "lg"}
              style={
                {
                  "--primary": actionBtnColor || "",
                  color: actionBtnTextColor || "",
                  "--tw-ring-color": actionBtnBorderColor,
                } as React.CSSProperties & Record<string, string>
              }
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </EditorContext.Provider>
    </div>
  );
}
