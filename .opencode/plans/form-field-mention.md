# Form Field Mention Feature Plan

## Overview

Implement an `@` mention system in form field labels that allows users to reference other form fields. When users type `@`, a dropdown appears showing all previous form fields with their labels as "name" and IDs as "value". When the form is submitted, these mentions are replaced with the actual field values.

## Current Architecture Understanding

### Form Structure

- Forms are built using Tiptap editor with custom form field nodes
- Each form field node has attributes: `id`, `label`, `placeholder`, `isRequired`, etc.
- Field nodes: `shortInput`, `LongInput`, `emailInput`, `dateInput`, `multipleChoiceInput`, `fileUploadInput`
- Form state is managed via `useFormStore` using react-hook-form
- Form values are stored as `Record<string, string | string[]>` where key is field ID

### Existing Infrastructure

- **Tiptap Mention extension** is already installed (`@tiptap/extension-mention`)
- **Slash menu** already exists using Tiptap's suggestion plugin (triggered by "/")
- **Suggestion configuration** in `slash-suggestions.ts` handles the slash command menu
- **Dropdown UI** already exists in `slash-component.tsx` using shadcn/ui Command component

## Implementation Plan

### Phase 1: Create Field Mention Suggestion System

#### 1.1 Create Field Mention Configuration

**File:** `apps/react/src/components/tiptap/field-mention-suggestions.ts`

Create a new suggestion configuration specifically for "@" trigger:

```typescript
interface FieldMentionItem {
  id: string;
  label: string;
  type: string; // field type (shortInput, LongInput, etc.)
}

export const fieldMentionSuggestion = {
  items: ({ query, editor }) => {
    // Get all field nodes from editor JSON
    const fields = extractFieldsFromEditor(editor);

    // Filter out current field and future fields (only show previous fields)
    const currentPos = editor.state.selection.from;
    const previousFields = fields.filter((field) => field.pos < currentPos);

    // Filter by query
    return previousFields.filter((field) =>
      field.label.toLowerCase().includes(query.toLowerCase()),
    );
  },
  render: () => {
    // Use ReactRenderer with FieldMentionDropdown component
  },
  char: "@",
};
```

#### 1.2 Create Field Mention Dropdown Component

**File:** `apps/react/src/components/tiptap/extenstions/field-mention-component.tsx`

Similar to `slash-component.tsx`, but adapted for field mentions:

```typescript
interface FieldMentionItem {
  id: string;
  label: string;
  type: string;
}

export const FieldMentionMenu = React.memo(
  forwardRef<any, SuggestionProps<FieldMentionItem[], any>>((props, ref) => {
    const { items, editor, query } = props;

    // Render dropdown showing field labels
    // Group by field type
    // Handle selection to insert mention node
  }),
);
```

#### 1.3 Create Utility to Extract Fields from Editor

**File:** `apps/react/src/lib/editor-helpers.ts` (extend existing)

```typescript
export interface FormFieldInfo {
  id: string;
  label: string;
  type: string;
  pos: number; // position in document
}

export function extractFieldsFromEditor(editor: Editor): FormFieldInfo[] {
  const fields: FormFieldInfo[] = [];
  const fieldTypes = [
    "shortInput",
    "LongInput",
    "emailInput",
    "dateInput",
    "multipleChoiceInput",
    "fileUploadInput",
  ];

  editor.state.doc.descendants((node, pos) => {
    if (fieldTypes.includes(node.type.name)) {
      fields.push({
        id: node.attrs.id,
        label: node.attrs.label,
        type: node.type.name,
        pos,
      });
    }
  });

  return fields;
}
```

### Phase 2: Configure Tiptap Mention Extension

#### 2.1 Update Extensions Configuration

**File:** `apps/react/src/components/tiptap/extenstions.ts`

Replace the current Mention configuration to support both slash and @ triggers:

```typescript
import { fieldMentionSuggestion } from "./field-mention-suggestions";
import { slashSuggestion } from "./slash-suggestions";

// Separate suggestion configs
export const extensions = [
  // ... other extensions

  // Slash command (existing)
  Mention.configure({
    suggestion: slashSuggestion,
    char: "/",
  }),

  // Field mention (new)
  Mention.configure({
    suggestion: fieldMentionSuggestion,
    char: "@",
  }),

  // ... rest of extensions
];
```

**Note:** Tiptap's Mention extension supports only one character per instance. We need to create separate mention instances or use a custom extension.

### Phase 3: Handle Mention Rendering and Storage

#### 3.1 Create Custom Mention Node or Configure Rendering

**Option A: Use Tiptap's Mention extension with custom rendering**

Configure how @mentions are stored and rendered:

```typescript
Mention.configure({
  suggestion: fieldMentionSuggestion,
  char: "@",
  renderLabel({ options, node }) {
    // Render as colored pill/badge showing field label
    return `${options.suggestion.char}${node.attrs.label}`;
  },
});
```

**Option B: Create custom field-reference node**
If Mention extension is too limiting, create a custom node:

**File:** `apps/react/src/components/tiptap/form-nodes/field-reference/node.ts`

```typescript
export const fieldReferenceNode = Node.create({
  name: "fieldReference",
  group: "inline",
  inline: true,
  selectable: true,

  addAttributes() {
    return {
      fieldId: { default: null },
      fieldLabel: { default: "" },
      fieldType: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-field-reference]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-field-reference": "",
        class: "field-reference",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FieldReferenceView);
  },
});
```

#### 3.2 Create Field Reference View Component

**File:** `apps/react/src/components/tiptap/form-nodes/field-reference/view.tsx`

```typescript
const FieldReferenceView = (props: NodeViewProps) => {
  const { fieldId, fieldLabel, fieldType } = props.node.attrs;

  return (
    <NodeViewWrapper as="span" className="inline">
      <span
        className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-sm font-medium inline-flex items-center gap-1 cursor-pointer hover:bg-primary/20 transition-colors"
        contentEditable={false}
      >
        <span className="text-primary/60">@</span>
        <span>{fieldLabel}</span>
        <span className="text-xs text-muted-foreground">({fieldType})</span>
      </span>
    </NodeViewWrapper>
  );
};
```

### Phase 4: Process Mentions on Form Submission

#### 4.1 Create Mention Resolution Utility

**File:** `apps/react/src/lib/mention-resolver.ts`

```typescript
import { JSONContent } from "@tiptap/core";

interface ResolveMentionsParams {
  content: JSONContent; // Editor JSON content
  formValues: Record<string, string | string[]>; // Form state values
}

export function resolveMentions({
  content,
  formValues,
}: ResolveMentionsParams): JSONContent {
  // Deep clone content
  const resolved = JSON.parse(JSON.stringify(content));

  // Traverse all nodes
  function traverse(node: JSONContent) {
    if (node.type === "fieldReference" || node.type === "mention") {
      const fieldId = node.attrs?.fieldId || node.attrs?.id;
      const fieldValue = formValues[fieldId];

      if (fieldValue !== undefined && fieldValue !== null) {
        // Replace with text node containing the value
        return {
          type: "text",
          text: Array.isArray(fieldValue) ? fieldValue.join(", ") : fieldValue,
        };
      }
    }

    if (node.content) {
      node.content = node.content.map(traverse);
    }

    return node;
  }

  return traverse(resolved);
}
```

#### 4.2 Update Form Submission

**File:** `apps/react/src/lib/form-submit.ts`

Update the submission logic to resolve mentions before saving:

```typescript
import { resolveMentions } from "./mention-resolver";

export const submitResponse = async ({
  data,
  formId,
  respondent,
  creator,
  content, // Add content parameter
}: IsubmitResponse & { content: JSONContent }) => {
  // Resolve mentions with actual values
  const resolvedContent = resolveMentions({
    content,
    formValues: data,
  });

  // Convert resolved content to text/HTML as needed
  // ... rest of submission logic
};
```

**Alternative: Resolve in Component Layer**
**File:** `apps/react/src/hooks/use-form-editor.ts` or form submission handler

Process mentions before form submission in the component layer instead.

### Phase 5: Filter Fields Based on Position

To ensure only previous fields (not current or future fields) are shown:

```typescript
function getPreviousFields(
  editor: Editor,
  currentPos: number,
): FormFieldInfo[] {
  const allFields = extractFieldsFromEditor(editor);

  // Filter fields that appear before current position
  return allFields.filter((field) => field.pos < currentPos);
}

// In suggestion items function:
items: ({ query, editor }) => {
  const { from } = editor.state.selection;
  const previousFields = getPreviousFields(editor, from);

  return previousFields.filter((field) =>
    field.label.toLowerCase().includes(query.toLowerCase()),
  );
};
```

## Technical Implementation Details

### Key Considerations

1. **Multiple Mention Instances**: Tiptap's Mention extension supports one trigger character per instance. We need two separate configurations:
   - `/` for slash commands (existing)
   - `@` for field mentions (new)

2. **Field Position Tracking**: Must track document position to filter only previous fields

3. **Mention Storage Format**: Store field metadata (id, label, type) in the mention node attributes

4. **Dynamic Suggestions**: The field list must update as the user adds/removes fields

5. **Form Value Resolution**: Need access to form state at submission time to replace mentions

### File Structure

```
apps/react/src/components/tiptap/
├── extenstions.ts                          # Update to include field mention
├── slash-suggestions.ts                    # Existing slash menu
├── field-mention-suggestions.ts            # NEW: @ mention suggestion config
├── extenstions/
│   ├── slash-component.tsx                 # Existing slash menu UI
│   └── field-mention-component.tsx         # NEW: @ mention dropdown UI
└── form-nodes/
    └── field-reference/                    # NEW: Custom field reference node
        ├── node.ts
        └── view.tsx

apps/react/src/lib/
├── editor-helpers.ts                       # Extend with extractFieldsFromEditor
└── mention-resolver.ts                     # NEW: Resolve mentions to values
```

### State Flow

1. **Editor State** (Tiptap):
   - Contains field nodes with IDs and labels
   - Contains @mention nodes referencing other fields

2. **Form State** (react-hook-form):
   - Stores values as `Record<string, string | string[]>`
   - Key = field ID, Value = user input

3. **Submission Flow**:
   ```
   User submits form
     ↓
   Get form values from react-hook-form
     ↓
   Get editor JSON content
     ↓
   Resolve mentions using form values
     ↓
   Submit resolved data to backend
   ```

### Edge Cases to Handle

1. **Circular References**: Prevent or handle cases where Field A mentions Field B and Field B mentions Field A
2. **Deleted Fields**: Handle mentions of fields that no longer exist (show error or placeholder)
3. **Multi-page Forms**: Only show fields from current/previous pages
4. **Field Reordering**: Update mentions when fields are reordered
5. **Empty Values**: Handle cases where referenced field has no value yet

### UI/UX Considerations

1. **Dropdown Styling**: Match existing slash menu design
2. **Field Icons**: Show field type icon (text, email, date, etc.)
3. **Search**: Filter fields by label as user types
4. **Keyboard Navigation**: Arrow keys + Enter to select
5. **Visual Distinction**: Use badge/pill styling for mentions
6. **Hover States**: Show field preview on hover

## Testing Strategy

1. **Unit Tests**:
   - `extractFieldsFromEditor()` - correctly extracts fields
   - `resolveMentions()` - correctly replaces mentions with values
   - `getPreviousFields()` - correctly filters by position

2. **Integration Tests**:
   - Type `@` and verify dropdown appears
   - Select field from dropdown and verify mention inserted
   - Submit form and verify mentions resolved

3. **E2E Tests**:
   - Complete user workflow: Create form → Add fields → Add mentions → Submit → Verify resolution

## Future Enhancements

1. **Nested Mentions**: Allow mentions within mentions (e.g., "Hello @FirstName @LastName")
2. **Conditional Logic**: Show/hide fields based on mention values
3. **Default Values**: Set default values using mentions
4. **Validation**: Validate that all mentioned fields have values
5. **Auto-complete**: Suggest fields as user types without typing "@"

## Summary

This feature requires:

1. ✅ Reusing existing Tiptap infrastructure (Mention extension, suggestion plugin)
2. ✅ Creating field mention suggestion system with dynamic field list
3. ✅ Building dropdown UI for field selection
4. ✅ Extracting field metadata from editor
5. ✅ Creating custom mention node for storage
6. ✅ Processing mentions during form submission
7. ✅ Filtering fields by document position

Estimated Effort: **3-4 days** for implementation + **1-2 days** for testing and refinement.
