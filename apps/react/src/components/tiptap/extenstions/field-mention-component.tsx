import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion";
import { TextIcon } from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FieldMentionItem {
  id: string;
  label: string;
  type: string;
}

interface FieldMentionMenuRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

const FIELD_TYPE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  shortInput: TextIcon,
  LongInput: TextIcon,
  emailInput: TextIcon,
  dateInput: TextIcon,
  multipleChoiceInput: TextIcon,
  fileUploadInput: TextIcon,
};

const FIELD_TYPE_LABELS: Record<string, string> = {
  shortInput: "Short Text",
  LongInput: "Long Text",
  emailInput: "Email",
  dateInput: "Date",
  multipleChoiceInput: "Multiple Choice",
  fileUploadInput: "File Upload",
};

export const FieldMentionMenu = React.memo(
  forwardRef<FieldMentionMenuRef, SuggestionProps<FieldMentionItem, any>>(
    (props, ref) => {
      const { items, editor, query } = props;

      const [selectedIndex, setSelectedIndex] = useState(0);

      // Reset selection when items change
      if (items?.length && selectedIndex >= items.length) {
        setSelectedIndex(0);
      }

      const selectItem = useCallback(
        (index: number) => {
          const item = items?.[index];

          if (item) {
            const { from } = editor.state.selection;
            const mentionCharLength = query.length + 1; // +1 for @

            editor
              .chain()
              .focus()
              .deleteRange({
                from: Math.max(0, from - mentionCharLength),
                to: from,
              })
              .insertFieldReference({
                fieldId: item.id,
                fieldLabel: item.label,
                fieldType: item.type,
              })
              .run();
          }
        },
        [editor, items, query],
      );

      const upHandler = () => {
        const newIndex =
          selectedIndex === 0 ? (items?.length || 1) - 1 : selectedIndex - 1;
        setSelectedIndex(newIndex);
      };

      const downHandler = () => {
        const newIndex =
          selectedIndex === (items?.length || 1) - 1 ? 0 : selectedIndex + 1;
        setSelectedIndex(newIndex);
      };

      const enterHandler = () => {
        selectItem(selectedIndex);
      };

      useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: SuggestionKeyDownProps) => {
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

      if (!items || items.length === 0) {
        return (
          <Command className="z-50 w-72 overflow-hidden border border-primary/15 dark:border-primary/10 bg-popover shadow-md ring-4 ring-input/40 rounded-md">
            <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">
              No previous fields found
            </CommandEmpty>
          </Command>
        );
      }

      return (
        <Command
          role="listbox"
          className="z-50 w-72 overflow-hidden border border-primary/15 dark:border-primary/10 bg-popover shadow-md ring-4 ring-input/40 rounded-md"
        >
          <ScrollArea className="max-h-82.5 px-1 py-2">
            <CommandList>
              <CommandGroup
                heading={
                  <div className="px-2 py-1.5 font-medium text-muted-foreground">
                    Previous Fields
                  </div>
                }
              >
                {items.map((item, index) => {
                  const Icon = FIELD_TYPE_ICONS[item.type] || TextIcon;
                  return (
                    <CommandItem
                      role="option"
                      key={item.id}
                      value={`${item.type}-${item.id}`}
                      onSelect={() => selectItem(index)}
                      className={cn(
                        "gap-3 rounded-md cursor-pointer",
                        selectedIndex === index ? "bg-accent/80" : "",
                      )}
                      aria-selected={selectedIndex === index}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                        <Icon className="size-3" />
                      </div>
                      <div className="flex flex-1 flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          {item.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {FIELD_TYPE_LABELS[item.type] || item.type}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      );
    },
  ),
);
