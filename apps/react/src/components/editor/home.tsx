import { useForm } from "react-hook-form";
import { FormEditor } from "../tiptap/editor";
import { useEffect } from "react";
import { useFormStore } from "@/stores/useformStore";

export const EditorHome = () => {
  const form = useForm();

  useEffect(() => {
    if (useFormStore.getState().form) return;
    useFormStore.setState({ form });
  }, [form]);

  return (
    <div className="max-w-3xl mx-auto pt-8 px-4 grid gap-2">
      <FormEditor
        content={
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
