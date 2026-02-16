import { eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { formSetting as formSettingTable } from "../db/schema/form.settings";
import { commonCatch } from "../utils/error";
import bcrypt from "bcryptjs";
import { Result } from "better-result";
import { BcryptError, DatabaseError } from "../errors";
import { deleteFormCache } from "./form";
import jwt from "jsonwebtoken";
import { env } from "cloudflare:workers";

export const createFormSettingService = async (
  values: typeof formSettingTable.$inferInsert,
) => {
  try {
    const db = await getDb();
    const [settings] = await db
      .insert(formSettingTable)
      .values(values)
      .returning();
    return settings;
  } catch (e) {
    commonCatch(e);
  }
};

export const updateFormSettingService = async (
  values: typeof formSettingTable.$inferInsert,
) => {
  try {
    const db = await getDb();
    const [setting] = await db
      .update(formSettingTable)
      .set(values)
      .where(eq(formSettingTable.formId, values?.formId))
      .returning();

    await deleteFormCache(values.formId);
    return setting;
  } catch (e) {
    commonCatch(e);
  }
};

export const getFormSettingService = async (formId: string) => {
  try {
    const db = await getDb();
    const [settings] = await db
      .select()
      .from(formSettingTable)
      .where(eq(formSettingTable.formId, formId));
    return { ...settings, password: null };
  } catch (e) {
    commonCatch(e);
  }
};

export const resetFormSettings = async (formId: string) => {
  const execute = async () => {
    const db = await getDb();
    const [reset] = await db
      .update(formSettingTable)
      .set({
        password: null,
        isPasswordProtected: false,
        closeAfterSubmissions: null,
        closed: false,
        closingTime: null,
      })
      .where(eq(formSettingTable.formId, formId))
      .returning();
    return reset;
  };

  const result = await Result.tryPromise(execute);
  return result.match({
    ok: (v) => v,
    err: (e) => {
      throw new DatabaseError({
        cause: e,
        operation: "setFormPassword",
      });
    },
  });
};

export const setFormPassword = async (formId: string, password: string) => {
  const execute = async () => {
    const db = await getDb();
    const hashed = await bcrypt.hash(password, 10);
    await db
      .update(formSettingTable)
      .set({ password: hashed, isPasswordProtected: true })
      .where(eq(formSettingTable.formId, formId));
    return true;
  };

  const result = await Result.tryPromise(execute);
  return result.match({
    ok: (v) => v,
    err: (e) => {
      throw new BcryptError({
        cause: e,
        operation: "setFormPassword",
        message: `failed to hash password:formId:${formId}`,
      });
    },
  });
};

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
