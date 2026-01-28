import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export const MultiPageNodeView = () => {
  return (
    <NodeViewWrapper as={"div"} className="p-1 w-full flex flex-col gap-3 ">
      <div className="w-full py-1  font-semibold">New Page</div>
      <div className="w-full h-1 mb-2 bg-primary rounded-md"/>

      <NodeViewContent as="div" className=" p-6 border-3 border-dashed rounded-md" />
    </NodeViewWrapper>
  );
};
