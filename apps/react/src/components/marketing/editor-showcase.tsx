import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormStore } from "@/stores/useformStore";
import { FormEditor } from "../tiptap/editor";
import { MarketingContainer, MarketingSection } from "./marketing-layout";

export const EditorShowCase = () => {
  const hookForm = useForm();
  const { getHookForm } = useFormStore((s) => s);

  useEffect(() => {
    if (!getHookForm()) {
      useFormStore.setState({ form: hookForm });
    }
  }, [getHookForm, hookForm]);

  return (
    <MarketingSection border>
      <MarketingContainer className="mb-12">
        <h2 className="landing-heading mb-6 text-balance">
          Creating forms is as easy as writing docs
        </h2>
        <p className="landing-sub-heading text-balance">
          With our notion like editor, everything you need is available at{" "}
          <span className="bg-orange-500 text-white p-1">` /slash `</span>
        </p>
      </MarketingContainer>

      <div className="w-full grid sm:px-8 px-4 max-w-4xl mx-auto ">
        <FormEditor
          wrapperClassName="ring-4 ring-ring/15 dark:ring-ring/25 max-w-4xl mx-auto w-full px-1 pb-1 pt-6 rounded-md border bg-card"
          className="  max-w-4xl bg-background border  border-border/70 rounded-sm h-[60dvh] overflow-y-scroll text-foreground no-scrollbar scrollbar-track-accent scrollbar-thumb-muted-foreground"
          lastStepIndex={0}
          content={`
                  <p>Write or type '/' to create your first form.</p>
                  <p></p>
                  
                  <p></p>
                  `}
        />
      </div>
    </MarketingSection>
  );
};
