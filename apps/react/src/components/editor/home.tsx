import { useForm } from "react-hook-form";
import { FormEditor } from "../tiptap/editor";
import { useEffect } from "react";
import { useFormStore } from "@/stores/useformStore";
import { useEditorContentStore } from "@/stores/useEditorContent";
import { useCustomizationStore } from "@/stores/useCustomizationStore";

export const EditorHome = () => {
  const form = useForm();
  const { formBackgroundColor, reset } = useCustomizationStore((s) => s);
  const { content } = useEditorContentStore();

  useEffect(() => {
    useFormStore.setState({ form });
    useCustomizationStore.setState({
      isEditable: true,
    });

    reset();
  }, []);

  return (
    <div
      style={{ backgroundColor: formBackgroundColor || undefined }}
      className=""
    >
      <FormEditor
        lastStepIndex={0}
        content={
          content ||
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
