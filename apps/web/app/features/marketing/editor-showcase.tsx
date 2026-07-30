import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormStore } from "@/stores/useFormStore";
import { MarketingContainer, MarketingSection } from "./marketing-layout";
import { EditorShowCaseComp } from "@/components/tiptap/editor-showcase";

export const EditorShowCase = () => {
  const hookForm = useForm();
  const { getHookForm } = useFormStore((s) => s);

  useEffect(() => {
    if (!getHookForm()) {
      useFormStore.setState({ form: hookForm });
    }
  }, [getHookForm, hookForm]);

  return (
    <MarketingSection>
      <MarketingContainer className="mb-12 grid gap-8 ">
        <h1 className="landing-heading mb-6 text-balance text-center ">
          Simplest form builder. No learning curve. Just start typing
        </h1>
        <p className="landing-sub-heading  text-center sm:mx-auto mx-2 w mt-8  ">
          no drag and drop shit. If you’ve used Notion, you already know how this works. Just type
          `/` to get All your commands
        </p>

        <div className="mt-16">
          <EditorShowCaseComp />
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
};
