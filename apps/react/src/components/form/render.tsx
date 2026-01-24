import type { JSONContent } from "@tiptap/core";
import { FormEditor } from "../tiptap/editor";

export const FormRender = ({ content }: { content: JSONContent | string }) => {
  return (
    <div className="max-w-2xl mx-auto pt-8  px-4 grid gap-2">
      <FormEditor content={content} className="" />
    </div>
  );
};
