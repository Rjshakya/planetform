import { useForm } from "react-hook-form";
import { FormEditor } from "../tiptap/editor";
import { useFormStore } from "@/stores/useformStore";
import { useEffect } from "react";

export const EditorShowCase = () => {
  const hookForm = useForm();
  const { getHookForm } = useFormStore((s) => s);

  useEffect(() => {
    if (!getHookForm()) {
      useFormStore.setState({ form: hookForm });
    }
  }, [getHookForm, hookForm]);

  return (
    <div className="w-full">
      <div className="h-50 w-full" />

      <div className="px-2 max-w-4xl mx-auto">
        <h1 className="landing-heading mb-4 text-balance">
          Creating forms is as easy as writing docs
        </h1>
        <h3 className="landing-sub-heading text-balance">
          With our notion like editor , everything you need is available at{" "}
          <span className="bg-accent p-1">` /slash `</span>
        </h3>
      </div>

      <div className="h-14 w-full" />

      <div className="h-6 md:h-28 w-full  text-muted-foreground/40 dark:text-accent bg-size-[8px_8px] bg-top-left bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]" />

      <div className="w-full px-4 md:px-8 text-muted-foreground/40 dark:text-accent bg-size-[8px_8px] bg-top-left bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] ">
        <div
          style={{ scrollbarWidth: "thin" }}
          className="max-w-4xl mx-auto bg-background text-foreground overflow-y-auto"
        >
          <FormEditor
            lastStepIndex={0}
            content={`
                  <p>Write or type '/' to create your first form.</p>
                  <p></p>
                 
                  <p></p>
                  `}
          />
        </div>
      </div>
      <div className="h-6 md:h-28 w-full  text-muted-foreground/40 dark:text-accent bg-size-[8px_8px] bg-top-left bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]" />
      <div className="h-50 w-full" />
      <div />
    </div>
  );
};
