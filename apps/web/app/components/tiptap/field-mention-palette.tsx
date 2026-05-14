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
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarIcon,
  ListCheckIcon,
  ListChecksIcon,
  MailIcon,
  TextIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPreviousFields } from "@/lib/editor-helpers";

interface FieldMentionPaletteProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const FIELD_TYPE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  shortInput: TextIcon,
  LongInput: TextIcon,
  emailInput: MailIcon,
  dateInput: CalendarIcon,
  multipleChoiceInput: ListChecksIcon,
  fileUploadInput: ListCheckIcon,
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
  ({ editor, open, onClose, onOpenChange }: FieldMentionPaletteProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");

    const items = useMemo(() => {
      if (!editor || !open) return [];
      const { from } = editor.state.selection;
      const previousFields = getPreviousFields(editor, from);

      if (!query) {
        return previousFields;
      }

      return previousFields.filter((field) =>
        field.label.toLowerCase().includes(query.toLowerCase()),
      );
    }, [editor, open, query]);

    const handleSelect = React.useCallback(
      (field: { id: string; label: string; type: string }) => {
        try {
          editor
            .chain()
            .focus()
            .insertFieldReference({
              fieldId: field.id,
              fieldLabel: field.label,
              fieldType: field.type,
            })
            .run();
        } catch (error) {
          console.error("Error inserting field reference:", error);
        }
        setQuery("");
        onClose();
      },
      [editor, onClose],
    );

    useEffect(() => {
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
            placeholder="Search previous fields..."
            className="h-8 px-2 text-xs"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-82.5 px-1 py-2 overflow-y-auto">
            <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">
              No previous fields found
            </CommandEmpty>

            {items.length > 0 && (
              <CommandGroup
                heading={
                  <div className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
                    Previous Fields
                  </div>
                }
              >
                {items.map((item) => {
                  const Icon = FIELD_TYPE_ICONS[item.type] || TextIcon;
                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.type}-${item.id}-${item.label}`}
                      onSelect={() => handleSelect(item)}
                      className="gap-3 rounded-md p-2"
                    >
                      <div className="flex size-4 items-center justify-center ">
                        <Icon />
                      </div>
                      <div className="flex flex-1 flex-col min-w-0">
                        <span className="text-xs font-medium truncate">
                          {item.label}
                        </span>
                        {/* <span className="text-xs text-muted-foreground">
                          {FIELD_TYPE_LABELS[item.type] || item.type}
                        </span> */}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    );
  },
);
