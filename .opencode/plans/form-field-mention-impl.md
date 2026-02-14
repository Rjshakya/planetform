# Form Field Mention Implementation Plan

## Overview

Create a live-reactive `@` mention system that displays actual form field values in real-time.

## User Requirements (Confirmed)

1. **Empty Field Display**: Show just the label text (e.g., `@ Email`)
2. **Mention Editability**: Backspace removes like regular text
3. **Array Values**: Join multiple values with commas
4. **Circular References**: Allowed for now

## Architecture

### Core Concept

The `field-mention` node subscribes to react-hook-form state via `useFormStore` and renders the live field value. If empty, it displays the field label as fallback.

```
User types @
    ↓
Dropdown opens with previous fields
    ↓
User clicks field
    ↓
field-mention node inserted (stores fieldId, fieldLabel)
    ↓
Component watches form state
    ↓
Renders: @ [fieldValue || fieldLabel]
```

## Implementation Steps

### Phase 1: Create Field Mention Suggestion System

**File:** `apps/react/src/components/tiptap/field-mention-suggestions.ts`

**Requirements:**

- Trigger character: `@`
- Extract fields from editor document
- Filter only previous fields (before cursor position)
- Search/filter by label as user types
- Return array of `FieldMentionItem`

**Data Structure:**

```typescript
interface FieldMentionItem {
  id: string; // field ID (shortInput, LongInput, etc.)
  label: string; // field label text
  type: string; // field type name
  pos: number; // document position
}
```

**Key Functions:**

1. `extractFieldsFromEditor(editor)` - Traverse document and collect all field nodes
2. `filterPreviousFields(fields, currentPos)` - Filter fields before cursor
3. `filterByQuery(fields, query)` - Search/filter by label

### Phase 2: Create Field Mention Dropdown UI

**File:** `apps/react/src/components/tiptap/extenstions/field-mention-component.tsx`

**Requirements:**

- Match existing slash menu styling (Command component)
- Show field label and type
- Keyboard navigation (↑↓ arrows, Enter to select)
- ESC to close
- Group by field type (optional, can be flat list)

**UI Elements:**

- Field type icon (reuse from slash menu patterns)
- Field label text
- Optional: Field type badge

### Phase 3: Create Field Mention Node

**Files:**

- `apps/react/src/components/tiptap/form-nodes/field-reference/node.ts`
- `apps/react/src/components/tiptap/form-nodes/field-reference/view.tsx`

**Node Configuration:**

```typescript
{
  name: "fieldReference",
  group: "inline",
  inline: true,
  selectable: true,
  draggable: false,

  attrs: {
    fieldId: string,      // ID of referenced field
    fieldLabel: string,  // Label to show when value empty
    fieldType: string,   // Field type (for icon/display)
  }
}
```

**View Component Requirements:**

- Subscribe to form state via `useFormStore`
- Use `form.watch(fieldId)` for live updates
- Render: `@ {displayValue}`
- Handle arrays: `value.join(", ")`
- Empty state: Show `fieldLabel`
- Styling: Pill/badge style with primary color

### Phase 4: Update Tiptap Extensions

**File:** `apps/react/src/components/tiptap/extenstions.ts`

**Changes:**

- Add new `Mention` extension instance configured for `@`
- Add `fieldReferenceNode` to extensions array
- Configure both slash menu (`/`) and field mention (`@`)

**Configuration:**

```typescript
export const extensions = [
  // ... existing extensions

  // Slash commands (existing)
  Mention.configure({
    suggestion: slashSuggestion,
    char: "/",
  }),

  // Field mentions (new)
  Mention.configure({
    suggestion: fieldMentionSuggestion,
    char: "@",
  }),

  // Field reference node
  fieldReferenceNode,
];
```

## Technical Specifications

### Field Extraction Logic

```typescript
export function extractFieldsFromEditor(editor: Editor): FieldMentionItem[] {
  const fieldTypes = [
    "shortInput",
    "LongInput",
    "emailInput",
    "dateInput",
    "multipleChoiceInput",
    "fileUploadInput",
  ];

  const fields: FieldMentionItem[] = [];

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

### View Component Implementation

```typescript
const FieldReferenceView = (props: NodeViewProps) => {
  const { fieldId, fieldLabel } = props.node.attrs;
  const form = useFormStore.getState().getHookForm();

  // Watch field value for live updates
  const fieldValue = form?.watch(fieldId);

  // Format display value
  const displayValue = useMemo(() => {
    if (!fieldValue || fieldValue === '') {
      return fieldLabel;
    }

    if (Array.isArray(fieldValue)) {
      return fieldValue.join(', ');
    }

    return fieldValue;
  }, [fieldValue, fieldLabel]);

  return (
    <NodeViewWrapper as="span">
      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/10 text-primary text-sm font-medium">
        <span className="opacity-60 mr-0.5">@</span>
        <span>{displayValue}</span>
      </span>
    </NodeViewWrapper>
  );
};
```

### Suggestion Configuration

```typescript
export const fieldMentionSuggestion = {
  items: ({ query, editor }) => {
    const allFields = extractFieldsFromEditor(editor);
    const { from } = editor.state.selection;

    // Only show previous fields
    const previousFields = allFields.filter((field) => field.pos < from);

    // Filter by query
    if (!query) return previousFields;

    return previousFields.filter((field) =>
      field.label.toLowerCase().includes(query.toLowerCase()),
    );
  },

  render: () => {
    let component: ReactRenderer;
    let popup: Instance[];

    return {
      onStart(props) {
        component = new ReactRenderer(FieldMentionMenu, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component?.updateProps(props);
        popup?.[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onExit() {
        popup?.[0].destroy();
        component?.destroy();
      },

      onKeyDown(props) {
        const ref = component?.ref as any;
        return ref?.onKeyDown?.(props);
      },
    };
  },

  char: "@",
};
```

## File Structure

```
apps/react/src/components/tiptap/
├── extenstions.ts                          # Add field mention config
├── slash-suggestions.ts                    # Existing (unchanged)
├── field-mention-suggestions.ts            # NEW: @ mention logic
├── extenstions/
│   ├── slash-component.tsx                 # Existing (unchanged)
│   └── field-mention-component.tsx         # NEW: Dropdown UI
└── form-nodes/
    └── field-reference/                    # NEW: Custom node
        ├── node.ts
        └── view.tsx

apps/react/src/lib/
└── editor-helpers.ts                       # Extend with extractFieldsFromEditor
```

## Dependencies

**No new npm packages required** - using existing:

- `@tiptap/extension-mention` (already installed)
- `@tiptap/suggestion` (already installed)
- React Hook Form (already in useFormStore)

## Edge Cases & Handling

1. **Field Deleted After Mention Created:**
   - Show field label as fallback
   - Optional: Strike-through styling to indicate broken reference

2. **Field Label Changed After Mention Created:**
   - Mention stores original label, displays it
   - No automatic update (by design)

3. **Circular References:**
   - Allowed as per requirements
   - Both fields will show each other's labels if values empty

4. **Multi-page Forms:**
   - Current implementation shows all previous fields in document
   - Multi-page logic can be added later if needed

5. **Array Values:**
   - Join with commas as specified
   - Example: `["red", "blue", "green"]` → "red, blue, green"

## Styling Guidelines

**Mention Pill Design:**

- Background: `bg-primary/10` (primary color 10% opacity)
- Text: `text-primary` (primary color)
- Border-radius: `rounded-md`
- Padding: `px-1.5 py-0.5`
- Font: `text-sm font-medium`
- "@" symbol: 60% opacity for visual distinction

**Example:**

```
[@ Email]          ← empty field
[@ john@email.com]  ← filled field
[@ red, blue]       ← multi-select field
```

## Testing Checklist

**Phase 1: Suggestion System**

- [ ] Type `@` shows dropdown
- [ ] Only previous fields appear (not future fields)
- [ ] Typing filters field list
- [ ] Keyboard navigation works (↑↓ Enter)
- [ ] ESC closes dropdown

**Phase 2: Node Creation**

- [ ] Clicking field inserts mention
- [ ] Mention displays @ symbol + field label (initially)
- [ ] Mention is inline and doesn't break layout

**Phase 3: Live Updates**

- [ ] Typing in referenced field updates mention value
- [ ] Empty field shows label
- [ ] Array values joined with commas
- [ ] Values update in real-time without page refresh

**Phase 4: Edge Cases**

- [ ] Deleted field shows label
- [ ] Circular references work
- [ ] Backspace removes mention character by character
- [ ] Form submission unaffected

## Implementation Order

1. Create `field-mention-suggestions.ts` (suggestion logic)
2. Create `field-mention-component.tsx` (dropdown UI)
3. Create `field-reference/node.ts` (node definition)
4. Create `field-reference/view.tsx` (reactive component)
5. Update `extenstions.ts` (register new extensions)
6. Test and refine

## Estimated Effort

- Phase 1: 2-3 hours
- Phase 2: 1-2 hours
- Phase 3: 2-3 hours
- Phase 4: 30 minutes
- Testing & Refinement: 2 hours

**Total: 1.5-2 days**
