import { useCurrentEditor } from "@tiptap/react";
import { useFormStore } from "@/stores/useformStore";
import { getConditionalVisibility } from "@/components/custom-nodes/conditional-logic/evaluation";

export const useConditionalVisibility = (fieldId: string) => {
  const { editor } = useCurrentEditor();
  const form = useFormStore.getState().getHookForm();

  if (!editor || !form) return true;

  // Watch all form values for changes that might affect visibility
  const formValues = form.watch();

  // Find all conditional logic nodes
  const conditionalLogicNodes: any[] = [];
  editor.state.doc.descendants((node) => {
    if (node.type.name === "conditionalLogic") {
      conditionalLogicNodes.push(node);
    }
  });

  // Check if this field should be visible
  return getConditionalVisibility(fieldId, conditionalLogicNodes, formValues);
};

export const useConditionalIndicators = (fieldId: string) => {
  const { editor } = useCurrentEditor();

  if (!editor) return { isControlled: false, controllingNodes: [] };

  const controllingNodes: any[] = [];
  editor.state.doc.descendants((node) => {
    if (node.type.name === "conditionalLogic") {
      const { targetFieldIds } = node.attrs;
      if (targetFieldIds.includes(fieldId)) {
        controllingNodes.push(node);
      }
    }
  });

  return {
    isControlled: controllingNodes.length > 0,
    controllingNodes,
  };
};
