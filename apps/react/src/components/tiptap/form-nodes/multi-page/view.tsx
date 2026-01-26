import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export const MultiPageNodeView = () => {
  return (
    <NodeViewWrapper as={"div"} className="p-1 w-full flex flex-col gap-1 ">
      <div className="w-full border-b py-1">New Page</div>
      <NodeViewContent as="div" className="border p-1" />
    </NodeViewWrapper>
  );
};
