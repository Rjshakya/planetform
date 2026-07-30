import { EditorContent, EditorContext } from "@tiptap/react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { SlashCommandMenu } from "./slash-command-palette";
import { useEditorStore } from "@/stores/useEditorStore";
import { useEffect, useRef, useState } from "react";
import type { EditorView } from "@tiptap/pm/view";
import { useFormEditor } from "@/hooks/use-form-editor";

export const EditorShowCaseComp = () => {
  const { isEditable } = useEditorStore((s) => s);

  const [slashOpen, setSlashOpen] = useState(false);
  const slashRef = useRef<((view: EditorView) => boolean) | null>(null);

  const mentionRef = useRef<((view: EditorView) => boolean) | null>(null);

  const editor = useFormEditor("", isEditable, slashRef, mentionRef);

  const handleCloseCommandMenu = () => {
    setSlashOpen(false);
    editor?.commands.focus();
  };

  useEffect(() => {
    slashRef.current = () => {
      if (!editor || !editor.isEditable) return false;

      const { selection } = editor.state;
      const parentNode = selection.$from.node(selection.$from.depth);
      if (parentNode.type.name === "codeBlock") return false;

      setSlashOpen(true);
      return true;
    };
  }, [editor]);

  if (!editor) return null;
  return (
    <Card className=" bg-[url(/bg-img3.webp)] bg-cover ">
      <CardContent>
        <EditorContext.Provider value={{ editor }}>
          <form
            id={"vite-react-form"}
            className={cn(
              "drop-shadow-lg",
              `main-form rounded-2xl relative w-full overflow-hidden overflow-y-scroll h-120`,
            )}
            style={
              {
                scrollbarWidth: "none",
              } as React.CSSProperties & Record<string, string>
            }
          >
            <EditorContent
              editor={editor}
              className="w-full min-w-full cursor-text sm:px-8 sm:pt-8 px-4"
            />

            {/* Submit Button */}
          </form>
        </EditorContext.Provider>

        <SlashCommandMenu
          editor={editor}
          open={slashOpen}
          onClose={handleCloseCommandMenu}
          onOpenChange={setSlashOpen}
        />
      </CardContent>
    </Card>
  );
};
