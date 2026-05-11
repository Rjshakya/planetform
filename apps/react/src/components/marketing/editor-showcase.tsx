import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormStore } from "@/stores/useFormStore";
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
    <MarketingSection>
      <MarketingContainer className="mb-12 grid gap-8 text-center">
        <h1 className="landing-heading mb-6 text-pretty ">
          Simplest form builder. No learning curve. Just start typing
        </h1>
        <p className="landing-sub-heading  text-center sm:mx-auto mx-2 w mt-8  ">
          no drag and drop shit. If you’ve used Notion, you already know how
          this works. Just type `/` to get All your commands
        </p>

        <div className=" relative hero-img md:p-24 pb-0 pt-12 px-8 bg-input md:h-150  sm:h-100 h-58 overflow-hidden rounded-2xl md:mt-28 mt-12">
          <img src="/image.png" className="rounded-md scale-120" />
        </div>
      </MarketingContainer>
    </MarketingSection>
  );
};
