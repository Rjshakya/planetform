import type { Editor } from "@tiptap/core";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { GripVertical, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export const DragHandleComp = ({ editor }: { editor: Editor }) => {
  const [nodePosition, setNodePosition] = useState<number | null>(null);
  const [nodeType, setNodeType] = useState<string | null>(null);

  const handleDelete = () => {
    if (nodePosition !== null && nodeType) {
      // Get the node size from the editor state
      const { state } = editor;
      const node = state.doc.nodeAt(nodePosition);

      if (node) {
        const nodeSize = node.nodeSize;
        // Delete the node by deleting the range from its start to end
        editor
          .chain()
          .focus()
          .deleteRange({ from: nodePosition, to: nodePosition + nodeSize })
          .run();

        // Reset state after deletion
        setNodePosition(null);
        setNodeType(null);
      }
    }
  };

  return (
    <DragHandle
      editor={editor}
      pluginKey={"drag-handle-plugin-key"}
      className=" flex flex-col sm:flex-row items-center justify-center pr-1 gap-.5 bg-card"
      onNodeChange={({ node, pos }) => {
        if (node) {
          setNodePosition(pos);
          setNodeType(node.type.name);
        }
      }}
      computePositionConfig={{ strategy: "fixed" }}
    >
      <Button
        className={"bg-card"}
        variant={"secondary"}
        size={"icon-xs"}
        onClick={handleDelete}
        disabled={!nodeType || nodePosition === null}
      >
        <TrashIcon className=" size-3.5" />
      </Button>

      <Button className={"bg-card"} variant={"secondary"} size={"icon-xs"}>
        <GripVertical className="size-4" />
      </Button>
    </DragHandle>
  );
};
