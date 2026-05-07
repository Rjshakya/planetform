import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useFormStore } from "@/stores/useformStore";
import { useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

const FieldReferenceView = (props: NodeViewProps) => {
  const { fieldId, fieldLabel } = props.node.attrs;
  const form = useFormStore.getState().getHookForm();
  const editable = props.editor.isEditable;

  // Watch field value for live updates
  const fieldValue = useWatch({
    control: form?.control,
    name: fieldId,
  });

  if (!editable) {
    return (
      <NodeViewWrapper as="span" className="inline">
        {fieldValue}
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper as="span" className="inline">
      <span
        className={cn(
          `inline-flex items-center px-1.5 py-0.5 rounded-md bg-primary/10 text-inherit  font-medium mx-0.5`,
        )}
        contentEditable={false}
      >
        <span className="opacity-60 mr-0.5">@</span>
        <span>{fieldValue || fieldLabel}</span>
      </span>
    </NodeViewWrapper>
  );
};

export default FieldReferenceView;
