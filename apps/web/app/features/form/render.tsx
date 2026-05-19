import type { JSONContent } from "@tiptap/core";
import { FormEditor } from "@/components/tiptap/editor";

export const FormRender = ({
  content,
  lastStepIndex,
}: {
  content: JSONContent | string;
  lastStepIndex: number;
}) => {
  return (
    <FormEditor lastStepIndex={lastStepIndex} content={content} className="" />
  );
};
