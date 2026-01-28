import type { Editor } from "@tiptap/core";
import type { SuggestionProps } from "@tiptap/suggestion";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommandItemType {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string;
  command: (editor: Editor) => void;
  group: string;
}

export type CommandGroupType = {
  group: string;
  items: Omit<CommandItemType, "group">[];
};

export const SlashMenu = React.memo(
  forwardRef<any, SuggestionProps<CommandGroupType, any>>((props, ref) => {
    const { items, editor, query } = props;

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selected, setSelected] = useState("");
    const flattend = useMemo(() => {
      let flat = [] as Omit<CommandItemType, "group">[];

      items?.forEach((g) => {
        flat = [...flat, ...g.items];
      });

      return flat;
    }, [items]);

    const executeCommand = useCallback(
      (commandFn: (editor: Editor) => void) => {
        try {
          const { from } = editor.state.selection;
          const slashCommandLength = query.length + 1;

          editor
            .chain()
            .focus()
            .deleteRange({
              from: Math.max(0, from - slashCommandLength),
              to: from,
            })
            .run();

          commandFn(editor);
        } catch (error) {
          console.error("Error executing command:", error);
        }
      },
      [editor, query],
    );

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        executeCommand(item.items[0].command);
      }
    };

    const upHandler = () => {
      const totalLen = props.items.reduce(
        (acc, group) => acc + group.items.length,
        0,
      );
      const idx = (selectedIndex + props.items.length - 1) % totalLen;
      setSelected(flattend[idx].title);
      setSelectedIndex(idx);
    };

    const downHandler = () => {
      const totalLen = props.items.reduce(
        (acc, group) => acc + group.items.length,
        0,
      );
      const idx = (selectedIndex + 1) % totalLen;
      setSelected(flattend[idx].title);

      setSelectedIndex(idx);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => {
      (() => setSelectedIndex(0))();
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: any }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <Command
        role="listbox"
        className="z-50 w-72 overflow-hidden border border-primary/15 dark:border-primary/10  bg-popover shadow-md ring-4
         ring-input/40 inset-shadow-xs inset-shadow-primary/10 rounded-md"
      >
        <ScrollArea className="max-h-82.5 px-1 py-2">
          <CommandList className="">
            <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">
              No results found
            </CommandEmpty>

            {items.map((group, i) => {
              return (
                <CommandGroup
                  key={`${group.group}-group-${i}`}
                  heading={
                    <div className="px-2 py-1.5  font-medium text-muted-foreground">
                      {group.group}
                    </div>
                  }
                >
                  {group.items.map((item, itemIndex) => {
                    return (
                      <CommandItem
                        role="option"
                        key={`${group.group}-${item.title}-${itemIndex}`}
                        value={`${group.group}-${item.title}`}
                        onSelect={() => executeCommand(item.command)}
                        className={cn(
                          "gap-3 rounded-md ",
                          `${selected === item.title ? "bg-accent/80" : ""}`,
                        )}
                        aria-selected={selectedIndex === itemIndex}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                          <item.icon className="size-3" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-medium capitalize">
                            {item.title}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {item.description}
                          </span>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </CommandList>
        </ScrollArea>
      </Command>
    );
  }),
);
