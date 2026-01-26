import { eq, name } from "drizzle-orm";
import { getDb } from "../db/config.js";
import { form } from "../db/schema/form.js";
import { workspace as workspaceTable } from "../db/schema/workspace.js";
import { commonCatch } from "../utils/error.js";
import { getIsProUser } from "../utils/subscription.js";
import { Result } from "better-result";
import { WorkspaceServiceError } from "../errors.js";

interface IupdateWorkspace {
  data: {
    name: string;
  };
  workspaceId: string;
}

export const createWorkspaceService = async (
  workspaceValues: typeof workspaceTable.$inferInsert,
) => {
  const promise = async () => {
    const db = await getDb();
    const workspaces = await db
      .select({ id: workspaceTable.id })
      .from(workspaceTable)
      .where(eq(workspaceTable.owner, workspaceValues.owner));

    if (workspaces.length) {
      const isProUser = await getIsProUser(workspaceValues.owner);
      if (!isProUser) {
        return false;
      }
    }

    const [workspace] = await db
      .insert(workspaceTable)
      .values(workspaceValues)
      .returning({
        id: workspaceTable.id,
        name: workspaceTable.name,
        owner: workspaceTable.owner,
      });

    return workspace;
  };

  const execute = await Result.tryPromise({
    try: promise,
    catch: (e) =>
      new WorkspaceServiceError({
        cause: e,
        operation: "createWorkspaceService",
      }),
  });

  if (Result.isOk(execute)) {
    return execute.value;
  }

  throw execute.error;
};

export const getUserWorkspaceService = async (
  owner: typeof workspaceTable.$inferSelect.owner,
) => {
  try {
    const db = await getDb();
    const workspace = await db
      .select()
      .from(workspaceTable)
      .where(eq(workspaceTable.owner, owner));

    return workspace;
  } catch (e) {
    commonCatch(e);
  }
};

export const getWorkspacesWithFormsService = async (userId: string) => {
  try {
    const db = await getDb();
    const res = await db.query.workspace.findMany({
      where: eq(workspaceTable.owner, userId),
      columns: {
        id: true,
        name: true,
      },
      with: {
        forms: {
          columns: {
            name: true,
            shortId: true,
          },
        },
      },
    });

    return res;
  } catch (e) {
    commonCatch(e);
  }
};

export const getWorkspaceWithFormsService = async (workspaceId: string) => {
  try {
    const db = await getDb();
    const res = await db
      .select({
        name: workspaceTable.name,
        id: workspaceTable.id,
        forms: {
          id: form.shortId,
          name: form.name,
          createdAt: form.createdAt,
        },
      })
      .from(workspaceTable)
      .leftJoin(form, eq(form.workspace, workspaceTable.id))
      .where(eq(workspaceTable.id, workspaceId));

    const reduced = res.reduce(
      (acc, curr) => {
        acc.id = curr.id;
        acc.name = curr.name;

        if (!acc.forms) {
          acc.forms = [];
        }

        if (curr.forms?.id) {
          acc.forms.push(curr.forms);
        }

        return acc;
      },
      {} as {
        name: string | null;
        id: string;
        forms: Array<{ id: string | null; name: string; createdAt: Date }>;
      },
    );

    return reduced;
  } catch (e) {
    commonCatch(e);
  }
};

export const updateWorkspaceFormService = async (params: IupdateWorkspace) => {
  try {
    const db = await getDb();
    const [updated] = await db
      .update(workspaceTable)
      .set({ ...params.data })
      .where(eq(workspaceTable.id, params.workspaceId))
      .returning();
    return updated;
  } catch (e) {
    commonCatch(e);
  }
};

export const deleteWorkspaceService = async (
  workspaceId: typeof workspaceTable.$inferInsert.id,
) => {
  try {
    const db = await getDb();
    const deleted = await db
      .delete(workspaceTable)
      .where(eq(workspaceTable.id, workspaceId!))
      .returning({ id: workspaceTable.id, user: workspaceTable.owner });

    return deleted[0];
  } catch (e) {
    commonCatch(e);
  }
};
