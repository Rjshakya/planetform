import type { Editor } from "@tiptap/core";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { GripVertical, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { handleFileDelete } from "@/lib/file";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "../ui/item";

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

        if (node.type.name === "image") {
          const url = node.attrs?.src;
          handleFileDelete(url).catch(console.log);
        }
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
      className=" flex flex-col sm:flex-row items-center justify-center pr-1 gap-.5 "
      onNodeChange={({ node, pos }) => {
        if (node) {
          setNodePosition(pos);
          setNodeType(node.type.name);
        }
      }}
      computePositionConfig={{ strategy: "fixed" }}
    >
      <Popover>
        <PopoverTrigger
          render={
            <Button variant={"ghost"} size={"icon-xs"}>
              <GripVertical className="size-4" />
            </Button>
          }
        />
        <PopoverContent side="left" className="min-w-40 p-1">
          <p className="px-4 pt-2">{nodeType}</p>
          <ItemGroup>
            <button onClick={handleDelete}>
              <Item className="text-destructive hover:bg-secondary transition-colors duration-300 ease-in">
                <ItemMedia>
                  <TrashIcon className=" size-3.5" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Delete</ItemTitle>
                </ItemContent>
              </Item>
            </button>
          </ItemGroup>
        </PopoverContent>
      </Popover>
    </DragHandle>
  );
};
