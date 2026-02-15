# Form Auto-Close Feature Implementation Plan

## Overview

Add client-side UI for configuring form auto-close settings with three mutually exclusive options: close immediately, close on date, or close after submissions.

## Current State

### Server-Side (Already Implemented)

- **Database Schema** (`apps/server/src/db/schema/form.settings.ts`):
  - `closingTime`: timestamp field for auto-close date
  - `closeAfterSubmissions`: integer field for respondent limit
  - `closed`: boolean for manual close state
  - `closedMessage`: text for closed form message

- **API Endpoint** (`apps/server/src/api/form.ts:131-153`):
  - `POST /api/form/settings/update` accepts:
    - `formId: string` (required)
    - `closed: boolean` (optional)
    - `closedMessage: string` (optional)
    - `closingTime: Date` (optional) - **Must be Date object**
    - `closeAfterSubmissions: number` (optional)

- **Zod Validator** (lines 136-142):

```typescript
z.object({
  formId: z.string(),
  closed: z.boolean().optional(),
  closedMessage: z.string().optional(),
  closingTime: z.date().optional(), // Must be Date object
  closeAfterSubmissions: z.number().optional(),
});
```

- **Auto-Close Logic** (`apps/server/src/services/form.ts:462-500`):
  - `formClosingService` checks if closing time has passed
  - Checks if submission count reached limit
  - Automatically updates `closed` field when conditions met

### Client-Side Current State

- **Hook** (`apps/react/src/hooks/use-form.ts:78-93`):
  - `toggleFormClose` only sends `closed` and `formId`
  - **Need to extend** to accept optional `closingTime`, `closeAfterSubmissions`, `closedMessage`

- **UI** (`apps/react/src/components/form-settings/home.tsx`):
  - Only has simple manual close toggle switch
  - No UI for date picker or submission limit input

## Implementation Plan

### Phase 1: Extend Hook (apps/react/src/hooks/use-form.ts)

**Modify `toggleFormClose` function** (lines 78-93):

```typescript
export const toggleFormClose = async ({
  closed,
  formId,
  closingTime,
  closeAfterSubmissions,
  closedMessage,
}: {
  closed: boolean;
  formId: string;
  closingTime?: Date | null;
  closeAfterSubmissions?: number | null;
  closedMessage?: string;
}) => {
  // Convert null to undefined for API compatibility
  const payload: {
    closed: boolean;
    formId: string;
    closingTime?: Date;
    closeAfterSubmissions?: number;
    closedMessage?: string;
  } = {
    closed,
    formId,
  };

  // Only include if explicitly provided (not undefined)
  if (closingTime !== undefined && closingTime !== null) {
    payload.closingTime = closingTime;
  }

  if (closeAfterSubmissions !== undefined && closeAfterSubmissions !== null) {
    payload.closeAfterSubmissions = closeAfterSubmissions;
  }

  if (closedMessage !== undefined) {
    payload.closedMessage = closedMessage;
  }

  const res = await client.api.form.settings.update.$post({
    json: payload,
  });

  if (!res.ok) throw new Error("failed to update form settings");
  const data = await res.json();
  mutate(`useFormSettings:${formId}`);
  return data.settings;
};
```

**Update Form type** (lines 4-30) to include:

- `closingTime: string | null` (API returns ISO string)
- `closeAfterSubmissions: number | null`

### Phase 2: Create Auto-Close Settings Component

**New Component:** `apps/react/src/components/form-settings/close-settings.tsx`

**Three Radio Button Options:**

```
┌─────────────────────────────────────────────────┐
│ Form Close Settings                             │
├─────────────────────────────────────────────────┤
│ Choose how to close this form:                  │
│                                                 │
│ ○ Close form immediately                        │
│   Form will be closed right now                 │
│                                                 │
│ ○ Close on specific date                        │
│   ┌─────────────────────────────────────────┐   │
│   │ 📅 Dec 25, 2025 at 11:59 PM            │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
│ ○ Close after number of submissions             │
│   ┌─────────────────────────────────────────┐   │
│   │ Close after: [ 100 ] submissions       │   │
│   │ Currently: 42 submissions              │   │
│   └─────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ Closed Form Message                             │
│ ┌─────────────────────────────────────────┐     │
│ │ This form is closed.                    │     │
│ └─────────────────────────────────────────┘     │
│ 20/500 characters                               │
├─────────────────────────────────────────────────┤
│ [ Apply Settings ]                              │
└─────────────────────────────────────────────────┘
```

**Component Structure:**

```typescript
type CloseMethod = "immediate" | "date" | "submissions";

interface CloseSettingsProps {
  formId: string;
  currentSettings: {
    closed: boolean;
    closingTime: string | null; // ISO string from API
    closeAfterSubmissions: number | null;
    closedMessage: string | null;
  };
  currentSubmissionCount?: number;
}
```

**State Management:**

```typescript
const [closeMethod, setCloseMethod] = useState<CloseMethod>(() => {
  // Initialize based on current settings
  if (currentSettings.closed) return "immediate";
  if (currentSettings.closingTime) return "date";
  if (currentSettings.closeAfterSubmissions) return "submissions";
  return "immediate"; // default
});

const [closingDate, setClosingDate] = useState<Date | null>(() => {
  return currentSettings.closingTime
    ? new Date(currentSettings.closingTime)
    : null;
});

const [submissionLimit, setSubmissionLimit] = useState<number | null>(() => {
  return currentSettings.closeAfterSubmissions ?? null;
});

const [closedMessage, setClosedMessage] = useState(
  currentSettings.closedMessage || "This form is closed.",
);

const [isSubmitting, setIsSubmitting] = useState(false);
```

**Radio Group Options:**

1. **"Close form immediately"**
   - Sets `closed: true`
   - Clears `closingTime` and `closeAfterSubmissions`
   - Form closed right away

2. **"Close on specific date"**
   - Shows date/time picker
   - Sets `closingTime: Date` (Date object for API)
   - Sets `closed: false`
   - Clears `closeAfterSubmissions`

3. **"Close after number of submissions"**
   - Shows number input
   - Sets `closeAfterSubmissions: number`
   - Sets `closed: false`
   - Clears `closingTime`

**Date/Time Picker:**

- Use existing `Calendar` component
- Use `Popover` for dropdown
- Include time picker (hours, minutes) - can use native `<input type="time">`
- Minimum date/time: current date/time (disable past)
- Convert to Date object before sending to API

**Submission Limit Input:**

- `<Input type="number" min={1} />`
- Show current submission count below
- Validation: must be > current count (warning if not)

**Closed Message:**

- `<Textarea />`
- Default: "This form is closed."
- Max 500 chars with counter

**Apply Button:**

- Validates inputs
- Calls `toggleFormClose` with correct parameters
- Shows loading state
- Shows success/error toast

### Validation Rules

**Client-Side Validation:**

1. **Immediate close:**
   - No additional validation needed
   - Sets `closed: true`, clears other fields

2. **Date close:**
   - Date must be selected
   - Date must be in the future (>= now + 1 minute)
   - Error: "Please select a future date and time"

3. **Submission limit:**
   - Must be a positive integer (> 0)
   - Warning if <= current submission count:
     "Warning: This limit has already been reached. Form will close immediately."

4. **Closed message:**
   - Max 500 characters
   - Can be empty (uses default on server)

**Type Conversions for API:**

```typescript
// Before sending to API
const apiPayload = {
  closed: closeMethod === "immediate",
  formId,
  // For date: convert to Date object (Zod expects Date, not string)
  ...(closeMethod === "date" &&
    closingDate && {
      closingTime: closingDate, // Date object
    }),
  // For submissions: ensure it's a number
  ...(closeMethod === "submissions" &&
    submissionLimit && {
      closeAfterSubmissions: Number(submissionLimit),
    }),
  // Message (optional)
  ...(closedMessage && {
    closedMessage: closedMessage.trim(),
  }),
};

// When receiving from API
const closingDate = currentSettings.closingTime
  ? new Date(currentSettings.closingTime) // ISO string -> Date
  : null;
```

### Edge Cases

1. **Switching methods:**
   - When user switches radio buttons, don't clear other inputs immediately
   - Only on "Apply" determine which values to send
   - This allows user to switch back without losing data

2. **Form already closed:**
   - Show "Close form immediately" as selected
   - User can switch to auto-close options to reopen + set auto-close

3. **Date passed:**
   - If loaded settings have past date, show validation error
   - Require user to select new future date

4. **Submission limit reached:**
   - Show warning but allow apply
   - Server will close form immediately

5. **Both date and submissions set in DB:**
   - Server uses both (earliest condition wins)
   - UI only shows one method at a time
   - If both exist in DB, prioritize by which condition is met first

## UI Components to Use

- `RadioGroup`, `RadioGroupItem` - method selection
- `Calendar` - date picker (already exists)
- `Popover` - calendar dropdown (already exists)
- `Input` (type="number", type="time") - submission limit & time
- `Textarea` - closed message
- `Button` - apply settings
- `Card`, `CardHeader`, `CardTitle`, `CardDescription` - container
- `Label` - form labels
- `Alert` or inline error text - validation messages

## Files to Modify

1. `apps/react/src/hooks/use-form.ts` - Extend `toggleFormClose` function
2. `apps/react/src/components/form-settings/home.tsx` - Replace CloseForm with CloseSettings
3. `apps/react/src/components/form-settings/close-settings.tsx` - NEW FILE

## Implementation Steps

1. **Extend hook** (15 minutes)
   - Update function signature
   - Handle optional parameters
   - Ensure Date object sent for closingTime

2. **Build CloseSettings component** (2-3 hours)
   - Radio group with 3 options
   - Date/time picker (Calendar + time input)
   - Submission limit input
   - Closed message textarea
   - Validation logic
   - Apply button with loading state

3. **Integrate into settings page** (15 minutes)
   - Import and use CloseSettings
   - Pass form settings data

4. **Test scenarios** (30 minutes)
   - Close immediately
   - Set date close
   - Set submission limit
   - Validation errors
   - Type conversions

## Type Safety Checklist

- [ ] `closingTime` sent as `Date` object (not string) to match Zod `.date()`
- [ ] `closeAfterSubmissions` sent as `number` (not string)
- [ ] `closed` sent as `boolean`
- [ ] `formId` sent as `string`
- [ ] Handle `null` values by not including in payload or converting to `undefined`
- [ ] Convert API response `closingTime` (ISO string) to `Date` for UI

## Estimated Effort

- **Total: ~3-4 hours**

## Notes

- API endpoint already handles all parameters correctly
- Server-side `formClosingService` evaluates conditions on each form access
- Manual close (`closed: true`) overrides auto-close settings
- Date must be JavaScript Date object when sending to API (Zod validation)
