import type { JSONContent } from "@tiptap/core";
import { FormEditor } from "../tiptap/editor";

export const FormRender = ({
  content,
  lastStepIndex,
}: {
  content: JSONContent | string;
  lastStepIndex: number;
}) => {
  return (
    <div className="max-w-2xl mx-auto pt-8  px-4 grid gap-2">
      <FormEditor
        lastStepIndex={lastStepIndex}
        content={content}
        className=""
      />
    </div>
  );
};
