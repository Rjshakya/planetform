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
    <div className=" ">
      <FormEditor
        lastStepIndex={lastStepIndex}
        content={content}
        className=""
      />
    </div>
  );
};
