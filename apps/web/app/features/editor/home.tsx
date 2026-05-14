import { useForm } from "react-hook-form";
import { FormEditor } from "@/components/tiptap/editor";
import { useEffect } from "react";
import { useFormStore } from "@/stores/useFormStore";
import { useEditorContentStore } from "@/stores/useEditorContent";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { useEditorStore } from "@/stores/useEditorStore";
import { convertToStyles } from "@/lib/customization-styles";

export const EditorHome = () => {
  const form = useForm();
  const customizationState = useCustomizationStore((s) => s);
  const { content } = useEditorContentStore();

  useEffect(() => {
    useFormStore.setState({ form });
    useEditorStore.setState({ isEditable: true });
  }, []);

  const bgStyle = convertToStyles(customizationState);

  return (
    <div style={{ backgroundColor: bgStyle["--form-background"] }} className="">
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
