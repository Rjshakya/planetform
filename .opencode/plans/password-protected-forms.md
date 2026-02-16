# Password Protected Forms Implementation Plan (Refactored)

## Overview

Implement password protection for forms where respondents must authenticate via password before accessing. Uses JWT tokens stored in localStorage.

## User Comments Addressed

1. ✅ `isPasswordProtected` field already added to DB query - only need to update interface
2. ✅ Simplified auth check in FormHome using `<Navigate />` instead of useEffect + useState
3. ✅ Frontend types must match server response exactly

## Current Status

- ✅ Form settings UI for password (done)
- ✅ API for setting password (done)
- ✅ API for verifying password (done - returns boolean)
- ✅ Password hashing with bcrypt (done)
- ✅ `isPasswordProtected` field in schema (done)
- ✅ DB query already includes `isPasswordProtected: formSettingTable.isPasswordProtected`

## Required Changes

### 1. Backend - Modify verifyPassword to Return JWT

**File**: `apps/server/src/services/form.setting.ts`

```typescript
// Add imports
import jwt from "jsonwebtoken";
import { env } from "cloudflare:workers";

// Update return type and implementation
export const verifyPassword = async (
  formId: string,
  password: string,
): Promise<{ success: boolean; token?: string }> => {
  const execute = async () => {
    const db = await getDb();
    const [formSetting] = await db
      .select({ password: formSettingTable.password })
      .from(formSettingTable)
      .where(eq(formSettingTable.formId, formId));

    if (!formSetting.password) return { success: false };

    const isValid = await bcrypt.compare(password, formSetting.password);

    if (!isValid) return { success: false };

    const secret = env.JWT_SECRET;
    const token = jwt.sign(
      { formId, type: "password_protected_form" },
      secret,
      { expiresIn: "24h" },
    );

    return { success: true, token };
  };

  const res = await Result.tryPromise(execute);
  return res.match({
    ok: (v) => v,
    err: (e) => {
      throw new BcryptError({
        cause: e,
        message: `failed to verify password:${formId}`,
        operation: "verifyPassword",
      });
    },
  });
};
```

### 2. Backend - Update Verify Endpoint Response

**File**: `apps/server/src/api/form.ts`

Update the existing verify endpoint:

```typescript
.post(
  "/settings/password/verify",
  zValidator("json", z.object({ formId: z.string(), password: z.string() })),
  async (c) => {
    const { formId, password } = c.req.valid("json");
    const res = await verifyPassword(formId, password);
    return c.json(
      ApiResponse({
        data: { success: res.success, token: res.token },
        message: res.success ? "Password verified" : "Invalid password"
      }),
      res.success ? 200 : 401,
    );
  },
)
```

### 3. Backend - Add Token Verification Endpoint

**File**: `apps/server/src/api/form.ts`

Add new endpoint:

```typescript
.post(
  "/settings/password/check-auth",
  zValidator("json", z.object({ formId: z.string(), token: z.string() })),
  async (c) => {
    const { formId, token } = c.req.valid("json");

    try {
      const secret = env.JWT_SECRET;
      const decoded = jwt.verify(token, secret) as { formId: string; type: string };

      if (decoded.formId !== formId || decoded.type !== "password_protected_form") {
        return c.json(
          ApiResponse({ data: { isAuthenticated: false }, message: "Invalid token" }),
          401,
        );
      }

      return c.json(
        ApiResponse({ data: { isAuthenticated: true }, message: "Token valid" }),
        200,
      );
    } catch (error) {
      return c.json(
        ApiResponse({ data: { isAuthenticated: false }, message: "Invalid or expired token" }),
        401,
      );
    }
  },
)
```

### 4. Backend - Update Interface (DB Query Already Done)

**File**: `apps/server/src/services/form.ts`

The DB query already includes `isPasswordProtected: formSettingTable.isPasswordProtected`. Only update the interface:

```typescript
// Update IgetFormService interface
interface IgetFormService {
  id: string | null;
  name: string;
  form_schema: any;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
  customisation: IFormCustomization;
  closed: boolean | null;
  closedMessage: string | null;
  isPasswordProtected: boolean; // ADD THIS
}
```

Also update the return object in `getFormService` to include `isPasswordProtected` in both:

- The KV cache storage (around line 299-318)
- The return statement (around line 320-333)

### 5. Frontend - Update Form Type

**File**: `apps/react/src/hooks/use-form.ts`

Add field matching server response:

```typescript
export type Form =
  | {
      id: string | null;
      name: string;
      form_schema: any;
      creator: string;
      createdAt: string;
      updatedAt: string;
      customerId: string;
      customisation: { ... };
      closed: boolean | null;
      closedMessage: string | null;
      closingTime: string | null;
      closeAfterSubmissions: number | null;
      isPasswordProtected: boolean; // ADD THIS - matches server
    }
  | undefined;
```

### 6. Frontend - Create Password Auth Hook

**File**: `apps/react/src/hooks/use-form-password-auth.ts`

```typescript
import { useState, useCallback } from "react";
import { client } from "@/lib/hc";

const getStorageKey = (formId: string) => `pp_auth_${formId}`;

export const useFormPasswordAuth = (formId: string) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStoredToken = useCallback(() => {
    return localStorage.getItem(getStorageKey(formId));
  }, [formId]);

  const storeToken = useCallback(
    (token: string) => {
      localStorage.setItem(getStorageKey(formId), token);
    },
    [formId],
  );

  const clearToken = useCallback(() => {
    localStorage.removeItem(getStorageKey(formId));
  }, [formId]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);

    try {
      const res = await client.api.form.settings.password.verify.$post({
        json: { formId, password },
      });

      const data = await res.json();

      if (!res.ok || !data.data.success) {
        setError("Invalid password");
        return false;
      }

      if (data.data.token) {
        storeToken(data.data.token);
      }

      return true;
    } catch (e) {
      setError("Failed to verify password");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const checkIsAuthenticated = async (): Promise<boolean> => {
    const token = getStoredToken();
    if (!token) return false;

    try {
      const res = await client.api.form.settings.password["check-auth"].$post({
        json: { formId, token },
      });

      const data = await res.json();

      if (!res.ok || !data.data.isAuthenticated) {
        clearToken();
        return false;
      }

      return true;
    } catch (e) {
      clearToken();
      return false;
    }
  };

  return {
    verifyPassword,
    checkIsAuthenticated,
    getStoredToken,
    clearToken,
    isVerifying,
    error,
  };
};
```

### 7. Frontend - Create Verify Password Page

**File**: `apps/react/src/components/form/verify-password.tsx`

```typescript
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormPasswordAuth } from "@/hooks/use-form-password-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader } from "lucide-react";
import { toast } from "sonner";

export const VerifyPasswordPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { verifyPassword, isVerifying, error } = useFormPasswordAuth(formId!);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }

    const success = await verifyPassword(password);

    if (success) {
      toast.success("Access granted");
      navigate(`/${formId}`, { replace: true });
    } else {
      toast.error(error || "Invalid password");
    }
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Password Protected Form
          </h1>
          <p className="text-muted-foreground text-sm">
            This form is protected. Please enter the password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isVerifying}
            className="h-11"
          />

          <Button type="submit" className="w-full h-11" disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Access Form"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
```

### 8. Frontend - Update Form Home (Token Validation at Load)

**User Comment**: Token validation MUST happen at form load time. Don't let users fill out the entire form only to find out their token is invalid - that would be terrible UX.

**File**: `apps/react/src/components/form/home.tsx`

Create a wrapper component that validates the token via API before rendering the form:

```typescript
import { useEffect, useState } from "react";
import { useForm } from "@/hooks/use-form";
import { useLocation, useParams, Navigate } from "react-router-dom";
import { FormRender } from "./render";
import { Loader } from "lucide-react";
import { useFormRender } from "@/hooks/use-form-render";
import { useFormSteps } from "@/stores/useFormStepper";
import { AnimatePresence, motion } from "motion/react";
import { PrevBtn } from "../tiptap/editor";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import { useFormPasswordAuth } from "@/hooks/use-form-password-auth";

// Wrapper component that validates token before showing form
const PasswordProtectedForm = ({
  formId,
  children
}: {
  formId: string;
  children: React.ReactNode
}) => {
  const { checkIsAuthenticated, getStoredToken } = useFormPasswordAuth(formId);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const validateToken = async () => {
      // First check if token exists
      const token = getStoredToken();
      if (!token) {
        setAuthState("unauthenticated");
        return;
      }

      // Validate token with server
      const isValid = await checkIsAuthenticated();
      setAuthState(isValid ? "authenticated" : "unauthenticated");
    };

    validateToken();
  }, [checkIsAuthenticated, getStoredToken]);

  if (authState === "loading") {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center">
        <Loader className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <Navigate to={`/${formId}/verify`} replace />;
  }

  return <>{children}</>;
};

export const FormHome = () => {
  const { formId } = useParams();
  const { form, useFormError, useFormLoading } = useForm(formId!);
  const { currentStep } = useFormSteps((s) => s);
  const pages = useFormRender(form);
  const { pathname } = useLocation();
  const isPreview = pathname.includes("/preview");
  const { formBackgroundColor } = useCustomizationStore((s) => s);

  // Loading and error states
  if (useFormError) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-destructive">Oops, sorry we failed to load form.</p>
      </div>
    );
  }

  if (useFormLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!form?.form_schema || !pages) {
    return <p>error</p>;
  }

  if (form.closed) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center">
        <p className="text-destructive w-full text-center">Form is closed</p>
      </div>
    );
  }

  // Form content to render
  const formContent = (
    <main
      style={{ backgroundColor: formBackgroundColor || undefined }}
      className="no-scrollbar min-h-dvh flex flex-col items-center justify-center"
    >
      <motion.div layout className="w-full mb-4 max-w-3xl mx-auto">
        <PrevBtn formId={formId} isPreview={isPreview} />
      </motion.div>
      <AnimatePresence mode="popLayout">
        {pages.length > 0 && pages.map((p, i) => (
          currentStep === i && (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              <FormRender content={p} lastStepIndex={pages.length - 1} />
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </main>
  );

  // If password protected and not in preview mode, wrap with auth validation
  if (form.isPasswordProtected && !isPreview) {
    return (
      <PasswordProtectedForm formId={formId!}>
        {formContent}
      </PasswordProtectedForm>
    );
  }

  return formContent;
};
```

**Flow:**

1. Form loads → checks `isPasswordProtected`
2. If protected + not preview → renders `PasswordProtectedForm` wrapper
3. Wrapper checks localStorage for token → if none → redirect to `/verify`
4. If token exists → calls `checkIsAuthenticated()` to validate with server
5. Shows loading spinner while validating
6. If invalid → clears token → redirect to `/verify`
7. If valid → renders the actual form

**Result**: User can only see the form if they have a valid token. No risk of filling out a form with an invalid token.

### 9. Frontend - Update Routes

**File**: `apps/react/src/App.tsx`

```typescript
import { VerifyPasswordPage } from "./components/form/verify-password";

// Update routes
{
  path: "/:formId",
  children: [
    { index: true, element: <FormHome /> },
    { path: "verify", element: <VerifyPasswordPage /> },
  ],
}
```

### 10. Environment Setup

**File**: `apps/server/.env` and `apps/server/.env.production`

```bash
JWT_SECRET=your-secret-key-min-32-characters
```

**Deploy secret:**

```bash
wrangler secret put JWT_SECRET
```

## Summary

| File                                                 | Change                                        | Lines |
| ---------------------------------------------------- | --------------------------------------------- | ----- |
| `apps/server/src/services/form.setting.ts`           | Modify verifyPassword to return JWT           | ~30   |
| `apps/server/src/api/form.ts`                        | Update verify endpoint, add check-auth        | ~50   |
| `apps/server/src/services/form.ts`                   | Add isPasswordProtected to interface & return | ~15   |
| `apps/react/src/hooks/use-form.ts`                   | Add isPasswordProtected to Form type          | ~5    |
| `apps/react/src/hooks/use-form-password-auth.ts`     | Create new hook                               | ~80   |
| `apps/react/src/components/form/verify-password.tsx` | Create verify page                            | ~70   |
| `apps/react/src/components/form/home.tsx`            | Add Navigate check                            | ~20   |
| `apps/react/src/App.tsx`                             | Add verify route                              | ~5    |

## Security Notes

1. JWT Secret: Store in Cloudflare secrets, min 32 chars
2. Token Expiry: 24 hours
3. Token Scope: Single form only
4. Storage: localStorage per form (`pp_auth_${formId}`)
5. Preview: Bypasses password protection

## Testing

- [ ] Set password → visit form → redirects to verify
- [ ] Wrong password → error message
- [ ] Correct password → stores token → shows form
- [ ] Clear localStorage → redirects to verify again
- [ ] Preview mode shows form without password
- [ ] Non-protected forms work normally
