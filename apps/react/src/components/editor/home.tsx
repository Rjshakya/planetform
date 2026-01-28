import { useForm } from "react-hook-form";
import { FormEditor } from "../tiptap/editor";
import { useEffect } from "react";
import { useFormStore } from "@/stores/useformStore";
import { useEditorContentStore } from "@/stores/useEditorContent";

export const EditorHome = () => {
  const form = useForm();

  useEffect(() => {
    if (useFormStore.getState().form) return;
    useFormStore.setState({ form });
  }, [form]);

  return (
    <div className="grid gap-2">
      <FormEditor
        lastStepIndex={0}
        content={
          useEditorContentStore.getState().content ||
          `
          <h2>Welcome to the Planetform !</h2>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
           
          `
        }
      />
    </div>
  );
};
