import type { Editor } from "@tiptap/core";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { groups } from "./slash-commands";

interface SlashCommandPaletteProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const SlashCommandMenu = React.memo(
  ({ editor, open, onClose, onOpenChange }: SlashCommandPaletteProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSelect = React.useCallback(
      (commandFn: (editor: Editor) => void) => {
        try {
          commandFn(editor);
        } catch (error) {
          console.error("Error executing command:", error);
        }
        onClose();
      },
      [editor, onClose],
    );

    useEffect(() => {
      if (!open) return;

      inputRef.current?.focus();
    }, [open]);

    return (
      <CommandDialog
        className={cn(
          "bg-popover shadow-md border border-ring/20 ring ring-ring/40",
          "inset-shadow-xs inset-shadow-primary/10 rounded-md",
        )}
        open={open}
        onOpenChange={onOpenChange}
      >
        <Command>
          <CommandInput
            ref={inputRef}
            placeholder="Type a command..."
            className="h-8 px-2 text-xs"
          />
          <CommandList className="max-h-82.5 px-1 py-2 overflow-y-auto">
            <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">
              No results found
            </CommandEmpty>

            {groups.map((group) => {
              return (
                <CommandGroup
                  key={group.group}
                  heading={
                    <div className="py-2 font-medium text-muted-foreground text-xs">
                      {group.group}
                    </div>
                  }
                >
                  {group.items.map((item) => (
                    <CommandItem
                      key={`${group.group}-${item.title}`}
                      value={`${group.group}-${item.title}`}
                      onSelect={() => handleSelect(item.command)}
                      className="gap-3 rounded-md p-2"
                    >
                      <div className="flex size-4 items-center justify-center ">
                        <item.icon />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-xs font-medium capitalize">
                          {item.title}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    );
  },
);
